#include <windows.h>
#include <winuser.h>

#include <iostream>
using namespace std;
 
BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam);
	                       
	HWND workerw = NULL;
	HWND child = NULL;

int main()
{
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
	/*
	EnumWindows([&](HWND tophandle, LPARAM topparamhandle) -> BOOL
	{
		    HWND p = FindWindowEx(tophandle, 
		                                NULL, 
		                                "SHELLDLL_DefView", 
		                                NULL);
		
		    if (p != NULL)
		    {
		        // Gets the WorkerW Window after the current one.
		        workerw = FindWindowEx(NULL, 
		                                tophandle, 
		                                "WorkerW", 
		                                NULL);
		    }
		
		    return true;
	}, NULL);
	*/
	
    //HWND team = FindWindow("#≥Ì¿« - Discord", NULL);
    cout << child << endl;
	SetParent(child, workerw);
	//SetParent(0x00100D52, workerw);
	//cout << workerw << endl;
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
	    
	    /*
	    DWORD lpdwProcessId;
	    GetWindowThreadProcessId(hwnd,&lpdwProcessId);
    	if(lpdwProcessId==0x00100D52)
   		 {
       		 child=hwnd;
    	}*/
    	
	
	    return true;
}
