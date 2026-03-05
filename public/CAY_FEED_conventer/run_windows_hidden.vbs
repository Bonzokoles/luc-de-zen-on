' CAY_XLM_FEED_Converter - VBS Launcher
' Uruchamia .bat bez widocznego okna CMD

Set objShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
strBatFile = strPath & "\run_windows.bat"

' Uruchom .bat ukrycie (nie pokazuj okna CMD)
objShell.Run strBatFile, 0, False

' Wyświetl potwierdzenie w systemowym oknie
Set objFSO = CreateObject("Scripting.FileSystemObject")
If objFSO.FileExists(strPath & "\index.html") Then
    objShell.Popup "✅ Serwery uruchomione w tle!" & vbCrLf & vbCrLf & "Aplikacja powinna się otworzyć.", 3, "CAY Converter", 64
End If
