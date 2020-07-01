#include <windows.h>

#define BUFFER 255
char value[BUFFER];
DWORD BufferSize = BUFFER;

int main()
{
	RegGetValue(HKEY_CURRENT_USER,
		"Control Panel\\Desktop\\", "Wallpaper",
		RRF_RT_ANY,	NULL, (PVOID)&value, &BufferSize);
	SystemParametersInfo(SPI_SETDESKWALLPAPER, 0, value, SPIF_UPDATEINIFILE);
}
