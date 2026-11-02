# Screenshot runner — Fixora production build (Edge headless)
param(
  [string]$Out = "D:\project\pwa2\.shots",
  [string]$Base = "http://localhost:3000"
)

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$profileOut = Join-Path $Out "profiles\signedout"
$profileAuth = Join-Path $Out "profiles\authed"
New-Item -ItemType Directory -Force -Path $Out | Out-Null

function Shot($url, $file, $w, $h, $profile) {
  $path = Join-Path $Out $file
  $dir = Split-Path $path -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  if (Test-Path $path) { Remove-Item $path -Force }
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --user-data-dir="$profile" --window-size="$w,$h" `
    --virtual-time-budget=6000 --screenshot="$path" "$url" 2>$null | Out-Null
  $ok = Test-Path $path
  $size = if ($ok) { (Get-Item $path).Length } else { 0 }
  "{0} {1} ({2}x{3}) {4} bytes" -f $(if ($ok) { "OK  " } else { "FAIL" }), $file, $w, $h, $size
}

# ---- signed-out ----
Shot "$Base/"                      "so-home-320.png"          320  900  $profileOut
Shot "$Base/"                      "so-home-390.png"          390  844  $profileOut
Shot "$Base/"                      "so-home-1440.png"         1440 900  $profileOut
Shot "$Base/services"              "so-services-390.png"      390  844  $profileOut
Shot "$Base/services"              "so-services-1440.png"     1440 900  $profileOut
Shot "$Base/services/plumbing-services" "so-service-390.png"  390  844  $profileOut
Shot "$Base/auth"                  "so-auth-390.png"          390  844  $profileOut
Shot "$Base/bookings"              "so-bookings-390.png"      390  844  $profileOut
Shot "$Base/profile"               "so-profile-390.png"       390  844  $profileOut
Shot "$Base/offline"               "so-offline-390.png"       390  844  $profileOut
Shot "$Base/legal"                 "so-legal-390.png"         390  844  $profileOut

# ---- authenticated (seed via ?__auth=1) ----
Shot "$Base/?__auth=1"             "au-home-390.png"          390  844  $profileAuth
Shot "$Base/bookings"              "au-bookings-390.png"      390  844  $profileAuth
Shot "$Base/bookings/bk_1"         "au-booking-390.png"       390  844  $profileAuth
Shot "$Base/bookings/bk_4"         "au-booking-cancelled-390.png" 390 844 $profileAuth
Shot "$Base/bookings/new?service=plumbing-services" "au-new-390.png" 390 844 $profileAuth
Shot "$Base/notifications"         "au-notifications-390.png" 390  844  $profileAuth
Shot "$Base/profile"               "au-profile-390.png"       390  844  $profileAuth
Shot "$Base/profile/addresses"     "au-addresses-390.png"     390  844  $profileAuth
Shot "$Base/services/home-cleaning" "au-service-390.png"      390  844  $profileAuth
Shot "$Base/bookings"              "au-bookings-768.png"      768  1024 $profileAuth
Shot "$Base/"                      "au-home-768.png"          768  1024 $profileAuth
Shot "$Base/profile"               "au-profile-1440.png"      1440 900  $profileAuth
