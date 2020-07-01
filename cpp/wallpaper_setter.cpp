#include <windows.h>

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam);

HWND workerw = NULL;
HWND child = NULL;

int main(int argc, char **argv)
{
	child = (HWND) atoi(argv[1]);
	
	HWND progman = FindWindow("Progman", NULL);
	DWORD_PTR result = NULL;

	// Send 0x052C to Progman. This message directs Progman to spawn a 
	// WorkerW behind the desktop icons. If it is already there, nothing 
	// happens.
	SendMessageTimeout(progman, 
						   0x052C, 
						   0, 
						   0, 
						   SMTO_NORMAL, 
						   1000, 
						   &result);
	
	// We enumerate all Windows, until we find one, that has the SHELLDLL_DefView 
	// as a child. 
	// If we found that window, we take its next sibling and assign it to workerw.
	EnumWindows(EnumWindowsProc, NULL);
	SetParent(child, workerw);
}

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
{
		HWND p = FindWindowEx(hwnd, 
									NULL, 
									"SHELLDLL_DefView", 
									NULL);
	
		if (p != NULL)
		{
			// Gets the WorkerW Window after the current one.
			workerw = FindWindowEx(NULL, 
									hwnd, 
									"WorkerW", 
									NULL);
		}
		
		return true;
}
