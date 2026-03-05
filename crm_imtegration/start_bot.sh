#!/bin/bash
source /root/MovnaBot/crm_imtegration/myenv/bin/activate
nohup python3 /root/MovnaBot/crm_imtegration/main.py > /dev/null 2>&1 &
