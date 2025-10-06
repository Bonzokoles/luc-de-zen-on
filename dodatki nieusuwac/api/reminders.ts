import type { APIRoute } from 'astro';

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  userId?: string;
  completed: boolean;
  createdAt: number;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

// Simple in-memory storage (in production, use database)
const reminders: Reminder[] = [
  {
    id: '1',
    title: 'Spotkanie zespołowe',
    description: 'Cotygodniowe spotkanie z zespołem developerskim',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    userId: 'user123',
    completed: false,
    createdAt: Date.now() - 86400000,
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    recurrence: 'weekly'
  },
  {
    id: '2',
    title: 'Przegląd marketingowy',
    description: 'Analiza wyników kampanii i planowanie nowych akcji',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    userId: 'user456',
    completed: false,
    createdAt: Date.now() - 43200000,
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  },
  {
    id: '3',
    title: 'Backup danych',
    description: 'Rutynowy backup bazy danych i plików systemowych',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 21600000,
    notifications: {
      email: true,
      push: true,
      sms: true
    },
    recurrence: 'daily'
  }
];

export const GET: APIRoute = async ({ url }) => {
  const params = new URL(url).searchParams;
  const userId = params.get('userId');
  const priority = params.get('priority');
  const completed = params.get('completed');
  
  try {
    let filteredReminders = reminders;
    
    if (userId) {
      filteredReminders = filteredReminders.filter(r => r.userId === userId);
    }
    
    if (priority) {
      filteredReminders = filteredReminders.filter(r => r.priority === priority);
    }
    
    if (completed !== null) {
      filteredReminders = filteredReminders.filter(r => r.completed === (completed === 'true'));
    }
    
    // Sort by due date
    const sortedReminders = filteredReminders.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    
    // Calculate statistics
    const stats = {
      total: reminders.length,
      completed: reminders.filter(r => r.completed).length,
      overdue: reminders.filter(r => 
        new Date(r.dueDate).getTime() < Date.now() && !r.completed
      ).length,
      today: reminders.filter(r => {
        const today = new Date();
        const reminderDate = new Date(r.dueDate);
        return reminderDate.toDateString() === today.toDateString();
      }).length,
      high: reminders.filter(r => r.priority === 'high').length,
      medium: reminders.filter(r => r.priority === 'medium').length,
      low: reminders.filter(r => r.priority === 'low').length
    };
    
    return new Response(JSON.stringify({
      success: true,
      reminders: sortedReminders,
      stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to retrieve reminders'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate,
      priority: data.priority || 'medium',
      userId: data.userId,
      completed: false,
      createdAt: Date.now(),
      notifications: data.notifications || {
        email: true,
        push: false,
        sms: false
      },
      recurrence: data.recurrence
    };
    
    reminders.push(newReminder);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Reminder created successfully',
      reminder: newReminder
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create reminder'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const reminderIndex = reminders.findIndex(r => r.id === id);
    
    if (reminderIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Reminder not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    reminders[reminderIndex] = { ...reminders[reminderIndex], ...updateData };
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Reminder updated successfully',
      reminder: reminders[reminderIndex]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update reminder'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  const params = new URL(url).searchParams;
  const id = params.get('id');
  
  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Reminder ID is required'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    const reminderIndex = reminders.findIndex(r => r.id === id);
    
    if (reminderIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Reminder not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    reminders.splice(reminderIndex, 1);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Reminder deleted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to delete reminder'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
