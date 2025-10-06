# Test składni fragmentu
param([string]$Command = "help")

switch ($Command) {
    "test" {
        Write-Host "Test działa"
    }
    
    "send-docs" {
        if (Test-Path "docs\gemini") {
            try {
                $geminiTest = & where.exe gemini 2>$null
                if ($geminiTest) {
                    Write-Host "Gemini found"
                } else {
                    throw "Gemini CLI not found"
                }
            } catch {
                Write-Host "Error caught"
            }
        } else {
            Write-Host "Docs not found"
        }
    }
    
    "help" {
        Write-Host "Help działa"
    }
    
    default {
        Write-Host "Default"
    }
}