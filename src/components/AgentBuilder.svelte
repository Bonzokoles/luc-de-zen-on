<script>
  import { writable } from 'svelte/store';

  // Agent data store
  const agent = writable({
    name: '',
    description: '',
    type: 'chatbot',
    config: {}
  });

  // Handle form submission
  function createAgent() {
    // Placeholder for agent creation logic
    console.log('Creating agent with data:', $agent);
    // Here you would typically send the data to a backend API
    alert('Agent creation simulated. Check the console for the agent data.');
  }
</script>

<style>
  .agent-builder {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .btn {
    display: block;
    width: 100%;
    padding: 0.85rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn:hover {
    background-color: #0056b3;
  }
</style>

<div class="agent-builder">
  <h2>Agent Builder</h2>
  <form on:submit|preventDefault={createAgent}>
    <div class="form-group">
      <label for="agent-name">Agent Name</label>
      <input id="agent-name" type="text" bind:value={$agent.name} placeholder="e.g., Customer Support Bot" required />
    </div>

    <div class="form-group">
      <label for="agent-description">Agent Description</label>
      <textarea id="agent-description" bind:value={$agent.description} placeholder="Describe the agent's purpose and capabilities."></textarea>
    </div>

    <div class="form-group">
      <label for="agent-type">Agent Type</label>
      <select id="agent-type" bind:value={$agent.type}>
        <option value="chatbot">Chatbot</option>
        <option value="task_automation">Task Automation</option>
        <option value="data_analysis">Data Analysis</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <button type="submit" class="btn">Create Agent</button>
  </form>
</div>
