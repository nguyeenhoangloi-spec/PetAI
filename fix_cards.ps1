$file = 'templates\upgrade.html'
$lines = Get-Content $file
# Lines 1454-1628 are 0-indexed: 1453..1627
$before = $lines[0..1452]
$after = $lines[1628..($lines.Length-1)]
$result = $before + $after
$result | Set-Content $file -Encoding UTF8
Write-Host "Done. Total lines: $($result.Length)"
