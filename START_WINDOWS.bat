@echo off
setlocal
title BibelGenerator Server

cd /d "%~dp0"

echo ====================================================
echo           BIBELGENERATOR OFFLINE
echo ====================================================
echo.
echo  Startar servern...
echo.

start "" "http://127.0.0.1:8000/"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$l=New-Object Net.HttpListener; $l.Prefixes.Add('http://127.0.0.1:8000/'); $l.Start(); Write-Host 'Servern kor nu pa http://127.0.0.1:8000' -FG Cyan; while($l.IsListening){$c=$l.GetContext(); $rq=$c.Request; $rs=$c.Response; $p=$rq.Url.LocalPath.TrimStart('/'); if($p -eq ''){$p='index.html'}; $f=Join-Path $pwd $p; if(!(Test-Path $f -PathType Leaf)){ if(Test-Path \"$f.tsx\"){$f=\"$f.tsx\"} elseif(Test-Path \"$f.ts\"){$f=\"$f.ts\"} }; if(Test-Path $f -PathType Leaf){ Write-Host \"Skickar: $p\" -FG Gray; $b=[IO.File]::ReadAllBytes($f); $e=[IO.Path]::GetExtension($f).ToLower(); $t='text/plain'; if($e -eq '.html'){$t='text/html'} elseif($e -match '.js|.ts|.tsx'){$t='application/javascript'} elseif($e -eq '.css'){$t='text/css'} elseif($e -eq '.xml'){$t='text/xml'} elseif($e -match '.jpg|.jpeg'){$t='image/jpeg'} elseif($e -eq '.png'){$t='image/png'}; $rs.ContentType=$t; $rs.ContentLength64=$b.Length; $rs.OutputStream.Write($b, 0, $b.Length); } else { Write-Host \"FEL: Hittade inte $p\" -FG Red; $rs.StatusCode=404; }; $rs.Close(); }"
