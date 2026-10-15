#!/usr/bin/env bash
set -u
BASE="https://sankalppmc.com/images"
OUT="public/images"
mkdir -p "$OUT/small" "$OUT/aw"
get() { curl -fsSL --retry 2 -o "$OUT/$1" "$BASE/$1" && echo "ok   $1" || echo "FAIL $1"; }
for f in logo.png banner-new.jpg home-banner.jpg pro-10.jpg pro-20.jpg pro-30.jpg 02.jpg \
         san.jpg san1.jpg san2.jpg janmesh.jpg pro-pp.jpg add.png link.png like.png call.png fav2.png; do get "$f"; done
for i in $(seq 1 16); do get "icon-$i.png"; done
for f in about-us.jpg about-us-ban.jpg santosh-ananda-yadav.jpg aliabbasi.jpg \
         swapnil-chavan.jpg janmesh-patel.jpg akshay-mankame.jpg; do get "$f"; done
for i in $(seq 1 23); do get "small/pro-$i.jpg"; done
for f in services.jpg bansservices.jpg new-updates.jpg new-updates-ban.jpg awards.jpg awards-banner.jpg; do get "$f"; done
for i in $(seq 1 10); do get "aw/aw-$i.jpg"; done
get "aw/aw-111.jpeg"
for f in career.png career-ban.jpg iconify-icon0.png iconify-icon.png iconify-icon2.png \
         iconify-icon3.png iconify-icon4.png Vector.png; do get "$f"; done
