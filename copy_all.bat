

::FOR %%f IN ("ARONICLE/ERM/src/*) DO TYPE %%f>>aronicle_list.txt

::@echo off
::��������� ����������� ���������� ���������� �����
::��������� ������������ ���������� ��������� ���������� ������ �����, �������� �� � �����. ���� (!)
setlocal EnableDelayedExpansion
::������ �������������� ����
set $out=C:\Users\adm\git\out.txt
::������ ���������� �������� �����
set $srcDir=C:\Users\adm\git\ARONICLE\ERM\src
::����� ������ ������
set $mask=*.java

::���� ���� ��� ���� - �������
if exist "%$out%" del /f /q "%$out%"

set /a rf=1
 
::������� ������ ������ �������� ��������� ����� � ������ ������ ������ �� ������� ����������
for /f "delims=" %%i in ('dir "%$srcDir%\%$mask%" /s /b /a:-d') do (
  rem ���������� ������� ���-�� �����
  set /a r=1
  echo.  >>"%$out%
  echo.-----------------%%i-------------->>"%$out%
    for /f "usebackq delims=" %%a in ("%%i") do (
      rem ������� ��������� ��������, ������ � ������, ������������� ����� �� ������� ����
      echo.!rf!.!r! %%a>>"%$out%
      rem  ��������� 1
      set /a r+=1
      set /a rf+=1
    )
)