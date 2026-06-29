#!/bin/bash
apt-get update && apt-get install -y libxcb1 libx11-6 libx11-xcb1 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-render0 libxcb-shm0 libxcb-sync1 libxcb-util1 libxcb-xfixes0 libxcb-xinerama0
gunicorn --bind=0.0.0.0:8000 --timeout 600 app:app