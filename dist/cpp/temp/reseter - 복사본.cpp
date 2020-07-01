#include "iostream"
#include <windows.h>

#define BUFFER 255
char value[BUFFER];
DWORD BufferSize = BUFFER;


int main()
{
	if(RegGetValue(HKEY_CURRENT_USER,
		"Control Panel\\Desktop\\", "Wallpaper",
		RRF_RT_ANY,	NULL, (PVOID)&value, &BufferSize))
		SystemParametersInfo(SPI_SETDESKWALLPAPER, 0, value, SPIF_UPDATEINIFILE);

}

/*
void SetImage()
{
	RegistryKey theCurrentMachine = Registry.CurrentUser;
	RegistryKey theControlPanel = theCurrentMachine.OpenSubKey("Control Panel");
	RegistryKey theDesktop = theControlPanel.OpenSubKey("Desktop");
	SystemParametersInfo(SPI_SETDESKWALLPAPER, 0, Convert.ToString(theDesktop.GetValue("Wallpaper")), SPIF_UPDATEINIFILE);
}*/
