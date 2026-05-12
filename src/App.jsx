import { useState, useRef } from "react";

const CC_SECTIONS = [
  {
    id: "ec2",
    title: "EC2",
    content: 
    `
      1. Windows:
        → Create an EC2 
        → Select Windows
        → Click on connect 
        → RDP Client 
        → Download Remote Desktop
        → Get password 
        → decrypt 
        → paste in administrator
        Connect and administrator terminal will open

      2. Putty:
        → Create instance with key-pair ".ppk"
        → Connect 
        → EC2 instance connect
        → Open Putty
        → Paste IPV4 in hostname
        → Left terminal 
          → SSH 
            → Auth 
              → Credential
        → Upload .ppk file 
        → Click Open 
        → Login as username: xxxxx

      3. Puttygen:
        → Open PuTTYgen 
        → Click Load
        → Change file type to All Files (.)
        → Select your .pem file 
        → Click Save private key 
        → Save as .ppk
        → Open Putty 
        → Host: ec2-user@IP 
        → Repeat Putty process
    `,
  },
  {
    id: "ebs",
    title: "EBS",
    content: 
    `
      PHASE 1
        Creating and Attaching an EBS Volume: 
          Step 1: 
            Create EC2 instance with t2.micro
          Step 2: 
            EC2 Dashboard 
              → Volumes 
                → Create Volume
                  Type: gp3 
                  Size: 20 GiB
                  Same AZ as EC2
          Step 3: 
            Attach Volume 
              → Actions 
                → Attach Volume
                  Device name: /dev/xvdd
          Step 4: 
            Verify inside EC2 → lsblk
      PHASE 2
        Step 5: 
          sudo fdisk /dev/xvdd 
            → Inside fdisk: 
              n 
              p 
              Enter 
              Enter 
              Enter 
              w
          sudo partprobe
        Step 6: 
          lsblk
        Step 7: 
          sudo mkfs.xfs /dev/xvdd1
        Step 8: 
          sudo mkdir /mnt/ebsdata
        Step 9: 
          sudo mount /dev/xvdf1 /mnt/ebsdata 
            → Verify: 
              df -h
        Step 10: 
          cd /mnt/ebsdata && sudo touch testfile.txt && ls
      PHASE 3
        Step 11: 
          sudo blkid /dev/xvdd1
        Step 12: 
          sudo nano /etc/fstab
            Add: UUID=xxxx... /mnt/ebsdata xfs defaults,nofail 0 0
        Step 13: 
          sudo mount -a
        Step 14: 
          sudo reboot 
          → Reconnect 
          → df -h
    `,
  },
  {
    id: "efs",
    title: "EFS",
    content: 
    `
      1. Create Security Group
        Inbound: SSH 
                  → Anywhere 
                    | NFS 
                        → Anywhere
      2. Create EFS 
        → Add Security Group
      3. Create 2 EC2 instances 
        → Attach same Security Group
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

function DownloadBanner({ zipFile, onUpload, onRemove }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  if (zipFile) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          background: "#f7f7f7",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#555" }}>
          📦
        </span>
        <a
          href={zipFile.url}
          download={zipFile.name}
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#000",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            wordBreak: "break-all",
          }}
        >
          {zipFile.name}
        </a>
        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#aaa" }}>
          ({(zipFile.size / 1024).toFixed(1)} KB)
        </span>
        <button
          onClick={onRemove}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#aaa",
            padding: "2px 6px",
          }}
        >
          remove
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      style={{
        border: "1px dashed #ccc",
        borderRadius: "4px",
        padding: "14px 20px",
        marginBottom: "32px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#fafafa",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#999")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
    >
      <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#888" }}>
        + upload zip
      </span>
      <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#bbb" }}>
        drag & drop or click
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("cc");
  const [zipFile, setZipFile] = useState(null);

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setZipFile({ name: file.name, url, size: file.size });
  };

  const handleRemove = () => {
    if (zipFile) URL.revokeObjectURL(zipFile.url);
    setZipFile(null);
  };

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
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000" }}>
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
        <DownloadBanner
          zipFile={zipFile}
          onUpload={handleUpload}
          onRemove={handleRemove}
        />

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