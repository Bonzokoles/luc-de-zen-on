import os
import json
import time

# Configuration
WORKFLOW_DIR = r"U:\WWW_MyBonzo_com\.agents\Trinity_Workflow"
SHARED_STATE_DIR = os.path.join(WORKFLOW_DIR, "Shared_State")
LOGIC_BOT_PROMPT = os.path.join(WORKFLOW_DIR, "Logic_Bot", "prompt.txt")
CODE_SMITH_PROMPT = os.path.join(WORKFLOW_DIR, "Code_Smith", "prompt.txt")
QUALITY_MIND_PROMPT = os.path.join(WORKFLOW_DIR, "Quality_Mind", "prompt.txt")

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def run_agent(agent_name, prompt_path, input_context):
    print(f"\n--- Running Agent: {agent_name} ---")
    try:
        system_prompt = read_file(prompt_path)
    except FileNotFoundError:
        print(f"Error: Prompt file not found at {prompt_path}")
        return "Error"

    print(f"System Prompt Loaded: {len(system_prompt)} chars")
    print(f"Input Context: {input_context}")
    
    # Placeholder outputs for dry-run verification
    if agent_name == "Logic_Bot":
        write_file(os.path.join(SHARED_STATE_DIR, "Master_Plan.md"), "# Master Plan\n\n1. Analyze\n2. Build\n3. Test")
        return "Master Plan Created"
    elif agent_name == "Code_Smith":
        write_file(os.path.join(SHARED_STATE_DIR, "Build_Report.md"), "# Build Report\n\n- Built X\n- Weakness: None")
        return "Code Built"
    elif agent_name == "Quality_Mind":
        loop_decision = {
            "status": "COMPLETE",
            "loop_count": 0,
            "feedback": "Good job."
        }
        write_file(os.path.join(SHARED_STATE_DIR, "Feedback_Loop.json"), json.dumps(loop_decision, indent=2))
        return "Quality Check Passed"

def main():
    print("Initializing Trinity Workflow...")
    if not os.path.exists(SHARED_STATE_DIR):
        os.makedirs(SHARED_STATE_DIR)

    max_loops = 3
    current_loop = 0

    while current_loop < max_loops:
        print(f"\n=== LOOP {current_loop + 1} / {max_loops} ===")
        
        # 1. Logic_Bot
        run_agent("Logic_Bot", LOGIC_BOT_PROMPT, "Project Context: U:\\WWW_MyBonzo_com")
        
        # 2. Code_Smith
        run_agent("Code_Smith", CODE_SMITH_PROMPT, "Master Plan Ready")
        
        # 3. Quality_Mind
        run_agent("Quality_Mind", QUALITY_MIND_PROMPT, "Build Report Ready")
        
        # Check Feedback
        feedback_path = os.path.join(SHARED_STATE_DIR, "Feedback_Loop.json")
        if os.path.exists(feedback_path):
            with open(feedback_path, "r") as f:
                data = json.load(f)
            
            if data["status"] == "COMPLETE":
                print("\n✅ Workflow Completed Successfully!")
                break
            else:
                print(f"\n🔄 Loop Requested: {data['feedback']}")
                current_loop += 1
        else:
            print("Error: No feedback file found.")
            break

if __name__ == "__main__":
    main()
