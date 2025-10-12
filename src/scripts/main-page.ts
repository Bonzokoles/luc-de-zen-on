export function openImageGenerator() {
    console.log("openImageGenerator() called");
    const promptElement = document.getElementById(
      "imagePrompt"
    ) as HTMLInputElement;
    const prompt = promptElement ? promptElement.value.trim() : "";
    console.log("Image prompt:", prompt);
    if (prompt) {
      localStorage.setItem("quickPrompt", prompt);
      console.log("Prompt saved in localStorage");
    }
    console.log("Opening /image-generator");
    window.open("/image-generator", "_blank");
  }

  export function openChatbot() {
    console.log("💬 openChatbot() wywołana");
    const promptElement = document.getElementById(
      "chatPrompt"
    ) as HTMLInputElement;
    const prompt = promptElement ? promptElement.value.trim() : "";
    console.log("Chat prompt:", prompt);
    if (prompt) {
      localStorage.setItem("quickChatPrompt", prompt);
      console.log("Prompt saved in localStorage");
    }
    console.log("Opening /chatbot");
    window.open("/chatbot", "_blank");
  }

  export function openBigQuery() {
    console.log("📊 openBigQuery() wywołana");
    const promptElement = document.getElementById(
      "bigqueryPrompt"
    ) as HTMLInputElement;
    const prompt = promptElement ? promptElement.value.trim() : "";
    console.log("BigQuery prompt:", prompt);
    if (prompt) {
      localStorage.setItem("quickSQLQuery", prompt);
      console.log("SQL Query saved in localStorage");
    }
    console.log("Opening /bigquery-analytics");
    window.open("/bigquery-analytics", "_blank");
  }

  export function openKaggle() {
    console.log("🔍 openKaggle() wywołana");
    const promptElement = document.getElementById(
      "kagglePrompt"
    ) as HTMLInputElement;
    const prompt = promptElement ? promptElement.value.trim() : "";
    console.log("Kaggle prompt:", prompt);
    if (prompt) {
      localStorage.setItem("quickKaggleSearch", prompt);
      console.log("Kaggle search saved in localStorage");
    }
    console.log("Opening /kaggle-datasets");
    window.open("/kaggle-datasets", "_blank");
  }

  export function openTavily() {
    console.log("🌐 openTavily() wywołana");
    const promptElement = document.getElementById(
      "tavilyPrompt"
    ) as HTMLInputElement;
    const prompt = promptElement ? promptElement.value.trim() : "";
    console.log("Tavily prompt:", prompt);
    if (prompt) {
      localStorage.setItem("quickTavilySearch", prompt);
      console.log("Tavily search saved in localStorage");
    }
    console.log("Opening /tavily-search");
    window.open("/tavily-search", "_blank");
  }

  export function testButtonFunction(buttonType: string) {
    console.log(`🧪 TEST: Przycisk ${buttonType} został kliknięty!`);
    alert(`Test udany! Przycisk ${buttonType} działa.`);
    return false; // Prevent actual navigation
  }

  export async function runAllAPITests() {
    console.log("Rozpoczynam testy wszystkich API...");

    if ((window as any).apiTests && (window as any).apiTests.testAllAPIs) {
      try {
        await (window as any).apiTests.testAllAPIs();
        console.log("All API tests completed");
      } catch (error) {
        console.log("Error during API tests:", error);
      }
    } else {
      console.log(
        "⏳ API tests nie są jeszcze załadowane, próbuję ponownie..."
      );
      setTimeout(runAllAPITests, 1000);
    }
  }

  export function openAPITestConsole() {
    console.log("Opening API test console...");
    console.log("Available API tests:");
    console.log("- window.apiTests.testChatAPI()")
    console.log("- window.apiTests.testImageGeneration()")
    console.log("- window.apiTests.testAIBot()")
    console.log("- window.apiTests.testAllAPIs()")

    if ((window as any).apiTests) {
      console.log(
        "API Tests module loaded, available functions:",
        Object.keys((window as any).apiTests)
      );
    } else {
      console.log("API Tests module not loaded yet");
    }
  }

  export function openCloudflareWorkers() {
    // Check if workers dashboard is available
    const cloudflareUrl = "https://dash.cloudflare.com/";
    window.open(cloudflareUrl, "_blank");
  }

  export async function checkAllStatus() {
    const statusElement = document.getElementById("overallStatus");
    if (!statusElement) return;

    const statusDot = statusElement.querySelector(".status-dot");
    const statusText = statusElement.querySelector("span:last-child");

    if (!statusDot || !statusText) return;

    statusText.textContent = "Sprawdzanie...";
    statusDot.className = "status-dot";

    try {
      const apis = [
        "/api/generate-image",
        "/api/chat",
        "/api/bigquery",
        "/api/kaggle",
        "/api/tavi",
      ];

      const results = await Promise.allSettled(
        apis.map((api) => fetch(api).then((res) => ({ api, ok: res.ok })))
      );

      const onlineCount = results.filter(
        (result) => result.status === "fulfilled" && result.value.ok
      ).length;

      const totalCount = apis.length;

      if (onlineCount === totalCount) {
        statusDot.className = "status-dot online";
        statusText.textContent = `Wszystkie online (${onlineCount}/${totalCount})`;
      } else if (onlineCount > 0) {
        statusDot.className = "status-dot";
        statusText.textContent = `Częściowo online (${onlineCount}/${totalCount})`;
      } else {
        statusDot.className = "status-dot offline";
        statusText.textContent = `Offline (${onlineCount}/${totalCount})`;
      }
    } catch (error) {
      statusDot.className = "status-dot offline";
      statusText.textContent = "Błąd sprawdzania";
    }
  }

  export async function launchFlowise() {
    window.location.href = '/flowise-ai';
  }

  export function launchActivepieces() {
    window.location.href = '/activepieces-ai';
  }

  export function openFunction(functionName: string) {
    console.log(`🎯 KLIKNIĘTO KAFELEK! Otwieranie funkcji: ${functionName}`);
    alert(`DEBUGOWANIE: Kliknięto w funkcję: ${functionName}`);

    const functionRoutes: { [key: string]: string } = {
      rekomendacje: "/ai-functions/personalized-recommendations",
      "obsługa-klienta": "/ai-functions/customer-automation",
      monitorowanie: "/ai-functions/activity-monitoring",
      przypomnienia: "/ai-functions/reminders-calendar",
      "faq-generator": "/ai-functions/dynamic-faq",
      edukacja: "/ai-functions/education-recommendations",
      tickety: "/ai-functions/ai-tickets",
      quizy: "/ai-functions/interactive-quizzes",
      marketing: "/ai-functions/marketing-content",
      "voice-assistant": "/ai-functions/voice-assistant",
      "content-generator": "/ai-functions/content-generator",
      "analytics-dashboard": "/ai-functions/analytics-dashboard",
    };

    const route = functionRoutes[functionName];
    if (route) {
      console.log(`Przekierowanie do: ${route}`);
      window.open(route, "_blank");
    } else {
      console.error(`Nieznana funkcja: ${functionName}`);
      alert(
        `Funkcja "${functionName}" jest w trakcie implementacji. Spróbuj ponownie później.`
      );
    }
  }
