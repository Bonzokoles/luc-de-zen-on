import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../../utils/corsUtils';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  lastLogin: string;
  created: string;
  queries: number;
}

// Generate fallback users data
function generateFallbackUsers(): User[] {
  return [
    {
      id: '1',
      username: 'admin_haos77',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      queries: 1245
    },
    {
      id: '2',
      username: 'user_watson',
      email: 'watson@example.com',
      role: 'user',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      queries: 89
    },
    {
      id: '3',
      username: 'mod_nexus',
      email: 'nexus@example.com',
      role: 'moderator',
      status: 'active',
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      queries: 567
    },
    {
      id: '4',
      username: 'test_user',
      email: 'test@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      queries: 12
    },
    {
      id: '5',
      username: 'banned_user',
      email: 'banned@example.com',
      role: 'user',
      status: 'banned',
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      queries: 3
    }
  ];
}

export const OPTIONS: APIRoute = createOPTIONSHandler(['GET', 'POST', 'PUT', 'DELETE']);

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Warning: No authentication provided for admin users');
    }

    let users: User[];

    try {
      if (env?.ADMIN_DATA) {
        const cachedUsers = await env.ADMIN_DATA.get('users_list');
        if (cachedUsers) {
          users = JSON.parse(cachedUsers);
        } else {
          throw new Error('No cached users');
        }
      } else {
        throw new Error('No KV store available');
      }
    } catch (err) {
      // Generate fallback users
      users = generateFallbackUsers();

      // Try to cache the generated users
      if (env?.ADMIN_DATA) {
        try {
          await env.ADMIN_DATA.put('users_list', JSON.stringify(users), {
            expirationTtl: 3600 // 1 hour
          });
        } catch (cacheErr) {
          console.error('Failed to cache users:', cacheErr);
        }
      }
    }

    return createSuccessResponse(users);

  } catch (error) {
    console.error('Error fetching users:', error);

    // Return fallback data on error
    const fallbackUsers = generateFallbackUsers();
    return createSuccessResponse(fallbackUsers);
  }
};

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { username, email, role, status } = body;

    if (!username || !email || !role) {
      return createErrorResponse('Missing required fields: username, email, role', 400);
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: role as 'admin' | 'user' | 'moderator',
      status: status || 'active',
      lastLogin: new Date().toISOString(),
      created: new Date().toISOString(),
      queries: 0
    };

    // Try to add user to KV store
    if (env?.ADMIN_DATA) {
      try {
        const existingUsers = await env.ADMIN_DATA.get('users_list');
        const users = existingUsers ? JSON.parse(existingUsers) : generateFallbackUsers();

        // Check if username or email already exists
        const existingUser = users.find((u: User) => u.username === username || u.email === email);
        if (existingUser) {
          return createErrorResponse('Username or email already exists', 409);
        }

        users.push(newUser);

        await env.ADMIN_DATA.put('users_list', JSON.stringify(users), {
          expirationTtl: 3600
        });
      } catch (err) {
        console.error('Failed to save user to KV:', err);
      }
    }

    return createSuccessResponse({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return createErrorResponse('Internal server error', 500);
  }
};

export const PUT: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return createErrorResponse('User ID is required', 400);
    }

    // Try to update user in KV store
    if (env?.ADMIN_DATA) {
      try {
        const existingUsers = await env.ADMIN_DATA.get('users_list');
        const users = existingUsers ? JSON.parse(existingUsers) : generateFallbackUsers();

        const userIndex = users.findIndex((u: User) => u.id === id);
        if (userIndex === -1) {
          return createErrorResponse('User not found', 404);
        }

        // Update user with provided fields
        users[userIndex] = { ...users[userIndex], ...updates };

        await env.ADMIN_DATA.put('users_list', JSON.stringify(users), {
          expirationTtl: 3600
        });

        return createSuccessResponse({
          message: 'User updated successfully',
          user: users[userIndex]
        });
      } catch (err) {
        console.error('Failed to update user in KV:', err);
      }
    }

    return createErrorResponse('Failed to update user', 500);

  } catch (error) {
    console.error('Error updating user:', error);
    return createErrorResponse('Internal server error', 500);
  }
};

export const DELETE: APIRoute = async ({ locals, request }) => {
  try {
    const env = (locals as any)?.runtime?.env;

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    // Try to delete user from KV store
    if (env?.ADMIN_DATA) {
      try {
        const existingUsers = await env.ADMIN_DATA.get('users_list');
        const users = existingUsers ? JSON.parse(existingUsers) : generateFallbackUsers();

        const userIndex = users.findIndex((u: User) => u.id === userId);
        if (userIndex === -1) {
          return createErrorResponse('User not found', 404);
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        await env.ADMIN_DATA.put('users_list', JSON.stringify(users), {
          expirationTtl: 3600
        });

        return createSuccessResponse({
          message: 'User deleted successfully',
          user: deletedUser
        });
      } catch (err) {
        console.error('Failed to delete user from KV:', err);
      }
    }

    return createErrorResponse('Failed to delete user', 500);

  } catch (error) {
    console.error('Error deleting user:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
