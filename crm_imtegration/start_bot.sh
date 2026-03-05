#!/bin/bash
source /root/movna-test/crm_imtegration/myenv/bin/activate
nohup python3 /root/movna-test/crm_imtegration/main.py > /dev/null 2>&1 &
echo "Bot started"