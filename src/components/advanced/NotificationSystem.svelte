<script>
  import { onMount } from 'svelte';
  
  let notifications = [];
  let notificationId = 0;

  class NotificationManager {
    constructor() {
      this.queue = [];
      this.maxVisible = 5;
    }

    show(message, type = 'info', duration = 5000, actions = []) {
      const notification = {
        id: ++notificationId,
        message,
        type, // success, error, warning, info
        duration,
        actions,
        timestamp: Date.now(),
        persistent: duration === 0
      };

      notifications = [...notifications, notification];
      
      if (!notification.persistent) {
        setTimeout(() => this.remove(notification.id), duration);
      }

      return notification.id;
    }

    remove(id) {
      notifications = notifications.filter(n => n.id !== id);
    }

    success(message, actions) {
      return this.show(message, 'success', 4000, actions);
    }

    error(message, actions) {
      return this.show(message, 'error', 8000, actions);
    }

    warning(message, actions) {
      return this.show(message, 'warning', 6000, actions);
    }
  }

  onMount(() => {
    window.notifications = new NotificationManager();
  });
</script>

<div class="notification-container fixed top-4 right-4 z-50 space-y-2">
  {#each notifications as notification (notification.id)}
    <div 
      class="notification notification-{notification.type} 
             bg-white border-l-4 p-4 shadow-lg rounded-r-lg
             transform transition-all duration-300 ease-in-out
             max-w-md animate-slide-in"
      class:border-green-500={notification.type === 'success'}
      class:border-red-500={notification.type === 'error'}
      class:border-yellow-500={notification.type === 'warning'}
      class:border-blue-500={notification.type === 'info'}
    >
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <p class="text-sm text-gray-800">{notification.message}</p>
          {#if notification.actions?.length}
            <div class="mt-2 space-x-2">
              {#each notification.actions as action}
                <button 
                  class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  on:click={action.handler}
                >
                  {action.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>
        <button 
          class="ml-2 text-gray-400 hover:text-gray-600"
          on:click={() => window.notifications.remove(notification.id)}
        >
          ✕
        </button>
      </div>
    </div>
  {/each}
</div>

<style>
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>