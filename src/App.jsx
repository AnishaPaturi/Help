import { useState, useRef } from "react";

// ── Embedded zip files (base64) ──────────────────────────────────────────────
const ZIPS = {
  basic: {
    name: "basic-node-eb-app.zip",
    b64: "UEsDBBQAAAAIALWGrFxjCMoBwQAAABEBAAAJAAAAc2VydmVyLmpzTY5BigIxEEX3nuILQtIgGZeCKCgMzGpmGD2ATVs2rTEVK1EG1LtbLVmYXd6v+q8aDimD/qNQSphD6HzphKwpyFSzQfOaqWPUvGCruPDfn7+NBlG40cBRuLoXut8xnUwnOqebrqVszYcZw6phrJpUYb7AbQB9+nOJws6aL/KesRc+4Zt35A4Jn75OuWuwolp1tT9iGeOwv+tRlXLfpUzB9loVvBX3F7In57m12zXJlQRyCaELLTggsmSMbv3eY1sKn1BLAwQUAAAACAC1hqxc7mrxm5gAAADrAAAADAAAAHBhY2thZ2UuanNvbk2OTQ6CMBCF95xi0rU0YNzoThK3HMFkKLOoQmk6jTEh3N0ZwOjy/Xwvby4ATMCRzAVMh+xdGaaeSupKjNEcNH5RYj8FbdS2stXm9sQu+Zj3pFEWWmHtg+E2IGfRDWHgjMMTrt+1Ef0KMCUZlvJmb2MsySxSjYwpa1H/wK8t6bIfiBR6Cs7TH0bvmIjVMPeTrc/2uBLFUnwAUEsBAhQDFAAAAAgAtYasXGMIygHBAAAAEQEAAAkAAAAAAAAAAAAAAKSBAAAAAHNlcnZlci5qc1BLAQIUAxQAAAAIALWGrFzuavGbmAAAAOsAAAAMAAAAAAAAAAAAAACkgegAAABwYWNrYWdlLmpzb25QSwUGAAAAAAIAAgBxAAAAqgEAAAAA",
    label: "basic-node-eb-app.zip",
    desc: "Node.js app  ·  server.js + package.json",
  },
  styled: {
    name: "styled-node-eb-app.zip",
    b64: "UEsDBBQAAAAAALWGrFwAAAAAAAAAAAAAAAAHAAAAcHVibGljL1BLAwQUAAAACAC1hqxcCQ00fNoAAABuAQAACQAAAHNlcnZlci5qc32PMW8CMQyFd36Fh0pJpFNgRKro2JWqZYdrzjpSBSd1cggJ+O91UIqYyBS/5+/ZdpFyATwlxpxhBYy/k2fUqknKvM7crSf1Zf/YUOvqNrtPSdxG6Tv1sf7ciJ44OtEt0tHepMsFlovlQnAB7ZRRN9Tm0hfvdI23P9GT3m4Hz9QfsAOVpu/gnTLGNHLEotVcdaBlsU62ywZWb3CegTypbEYa3n3A54Hy8zTgye7LIaiafv2fEHwuSLpuLVMe0uuBMaANcdS7L+QjMvBE5GmESJAiF3g5V+66a4F/UEsDBBQAAAAIALWGrFwZuZczmgAAAO0AAAAMAAAAcGFja2FnZS5qc29uTY4xD4IwEIV3fsWlszRgXHTTxJXF3eSkb6hCaXqN0RD+uy1gdLz3vu/lxoJIOe6hDqQkvjuY0g0GJW4le682uX8iiB1cRmpd6WpJDaQN1se1ucwyNUnWd6FzxxJtSyewk8jdg47fuZ7tbAhCWk7wEi9rkpoxnTmIHGIG80P0o1M7rR94OAPXWvxpePkAyYG67nS919vZKKbiA1BLAwQUAAAACAC1hqxcWbuCs5oCAAAGBQAAEQAAAHB1YmxpYy9pbmRleC5odG1sdVTJbtswEL3nKybqITZgyZIXIFVkA9l66wIkPeRIiWOJCUUSJOWlRYF+Ry/9xX5CqTWxi8KwRc/GNzPvKTm/+3z7+PTlHgpb8vVZUj+AE5GvPBRebUBC12cASYmWQFYQbdCuvK+PH/xL79UhSIkrb8twp6S2HmRSWBQucMeoLVYUtyxDv/kzASaYZYT7JiMcV1EQtoUssxzXD/bAkcInSRGulUqmrbkOMLWrPgGkkh7ge3MEKInOmYghvOoMG3e7vyEl44cYrrW7awKGCOMb1GzTR6Uke8m1rASNgTOBRPu5JpQ53KNovqSYT+BdtIhwHrrDbDFPl8txn5xJLnUMu4JZ7G0FsrywMURhuC16I2VGceJwbDjue+NzZSzbHPxuTDFk7hd17yac5cJ3lUtz7Ppx1jyCOo84yHqYgcW99Zu802Jv29R5Skaz5XLSf8MgGlpShFIm8hgWoRqQplJT1H49l8qBmb11ucJUS+VvGHf3xZDySo8iFzF+zd77piBU7tx24FLtmwItjHDSfIL5+Ki3Ihp6atZo2Dd09wZLjeXV0cL9VFory3rePaiuhhpKSEUyZt30w+D9UUhauVxxQiHfSnXc4zCTaFaDX5wOJgYhBf5nWNHJsPotHJGmI1LHryMG7zo+pZLTIbzSpo5Xkv1Di7anuJDbt8TQjvgbqd2cGr2NnN5eadx4nRplLZ9gZvp6Tm3TTm7JtH0HJLXmGh1StoWME2NW3kBEr9VlUkTrP79//Wz0GzwbuL9pVezsbYBaP8lKQ12cmQLuXR3LMrhBB8QS/gJEKWDGKXKLQTJVXVq3LykyzrKXlec60XZ0cYeKy0PpCA8PVZahMZuKn1+MvfVtHQcfMZm2qQ3yqYNed9S24lA1b72/UEsBAhQDFAAAAAAAtYasXAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAQAO1BAAAAAHB1YmxpYy9QSwECFAMUAAAACAC1hqxcCQ00fNoAAABuAQAACQAAAAAAAAAAAAAApIElAAAAc2VydmVyLmpzUEsBAhQDFAAAAAgAtYasXBm5lzOaAAAA7QAAAAwAAAAAAAAAAAAAAKSBJgEAAHBhY2thZ2UuanNvblBLAQIUAxQAAAAIALWGrFxZu4KzmgIAAAYFAAARAAAAAAAAAAAAAACkgeoBAABwdWJsaWMvaW5kZXguaHRtbFBLBQYAAAAABAAEAOUAAACzBAAAAAA=",
    label: "styled-node-eb-app.zip",
    desc: "Node.js app with HTML  ·  server.js + package.json + public/index.html",
  },
  package: {
    name: "package.zip",
    b64: "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",
    label: "package.zip",
    desc: "server.js + package.json + package-lock.json",
  },
};

function b64toBlob(b64, mime = "application/zip") {
  const byteChars = atob(b64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  return new Blob([new Uint8Array(byteNums)], { type: mime });
}

function downloadZip(key) {
  const z = ZIPS[key];
  const blob = b64toBlob(z.b64);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = z.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const CC_SECTIONS = [
  {
    id: "ec2",
    title: "EC2",
    content: 
    `
      a) Connect using PuTTY (.ppk):
        Step 1: Create an EC2 with a key pair of .ppk, copy the IP of it.
        Step 2: Open PuTTY, paste the IP.
        Step 3: Left side: Connection → SSH → Auth → Credentials
                Browse the .ppk file and click Open.
        Step 4: If Linux → login as: ec2-user
                If Ubuntu → login as: ubuntu
                Test: whoami

      ──────────

      b) Convert .pem to .ppk (PuTTYGen):
        Step 1: Open PuTTYGen
        Step 2: Click Load → change file type to All Files (*)
        Step 3: Select your .pem file
        Step 4: Click Save private key → save as .ppk
        Step 5: Follow same process as (a) above with the .ppk

      ──────────

      c) RDP (Windows EC2):
        Step 1: Create an EC2 → in security groups add RDP in the custom TCP
                Select OS: Windows
        Step 2: Click on Connect → RDP client → click Get Password
                Upload the .pem file to decrypt the password
        Step 3: Click the Windows symbol and search RDP
                Paste the IP of the EC2
        Step 4: Login as: Administrator
                Password: decrypted password
        Step 5: A new system (Windows desktop) will open
    `,
  },
  {
    id: "ebs",
    title: "EBS — Volumes & Snapshots",
    content: 
    `
      PART A — Attach a Volume
        Step 1: Create an EC2, note the Availability Zone (AZ).
        Step 2: Create a Volume with the SAME AZ, any size.
        Step 3: Attach volume to running EC2
                  Actions → Attach Volume
                  Device name: /dev/sdf
        Step 4: Open EC2 console and run: lsblk

      ──────────

      PART B — Format and Mount the Volume
        (After attaching, connect to EC2 and run:)

        sudo su
        lsblk -fs
        fdisk /dev/nvme1n1       ← enter: m, n, p, Enter, Enter, Enter, w
        lsblk
        mkfs.xfs /dev/nvme1n1p1
        mkdir /mnt/vish
        mount /dev/nvme1n1p1 /mnt/vish
        df -h
        blkid /dev/nvme1n1p1    ← COPY UUID

        nano /etc/fstab
        (add at the last line:)
        UUID=<UUID-value>   /mnt/vish   xfs   defaults,nofail   0   0

        mount -a
        reboot → reconnect → check: df -h

      ──────────

      PART C — Move Volume to Another EC2
        Step 1: Create another EC2 in the SAME AZ.
        Step 2: Detach the volume from old EC2.
        Step 3: Attach to new EC2.
        Step 4: Connect to new EC2 and run:

        sudo su
        mkdir /mnt/vish
        mount /dev/nvme1n1p1 /mnt/vish
        lsblk -fs

      ──────────

      PART D — Snapshots
        Step 1: Select the volume → Actions → Create Snapshot.
        Step 2: Snapshots section → Copy Snapshot → select another region.
        Step 3: Switch to that region → select snapshot → Actions → Create Volume.
        Step 4: Attach an EC2 in that region to the created volume (same AZ).
                Run: lsblk   (to verify)
    `,
  },
  {
    id: "efs",
    title: "EFS",
    content: 
    `
      PART 1: CREATE SECURITY GROUP

        Step 1.1: Go to Security Groups
          EC2 → Security Groups → Create security group

        Step 1.2: Basic details
          Name:        efs-sg
          Description: Security group for EFS and EC2
          VPC:         default

        Step 1.3: Inbound rules
          Rule 1 — SSH
            Type:   SSH
            Port:   22
            Source: My IP

          Rule 2 — NFS
            Type:        NFS
            Port:        2049
            Source type: Security group
            Source:      efs-sg

        Save the security group.

      ──────────

      PART 2: LAUNCH EC2 INSTANCES (2 INSTANCES)

        EC2-1:
          EC2 → Launch instance
          Name:           EC2-1
          AMI:            Amazon Linux
          Instance type:  t2.micro
          Key pair:       create/select one
          Network:
            VPC:    default
            Subnet: AZ-1
          Security group: Select existing → choose efs-sg
          Launch

        EC2-2:
          Repeat same steps:
          Name:           EC2-2
          Subnet:         AZ-2
          Security group: efs-sg
          Launch

        → Now you have 2 EC2 instances in different AZs.

      ──────────

      PART 3: CREATE EFS

        Go to EFS → Create file system
        Select:
          VPC: default
        Click Create

        AWS will automatically:
          - Create mount targets
          - One per AZ

      ──────────

      PART 4: ATTACH SECURITY GROUP TO EFS

        Open your EFS → Go to Network tab
        For each mount target:
          Edit → Attach efs-sg → Save

      ──────────

      PART 5: CONNECT (MOUNT) EFS ON EC2

        Step 5.1: Login to EC2-1 (SSH in via terminal or EC2 Connect)

        Step 5.2: Switch to root:
          sudo su

        Step 5.3: Install EFS utils:
          sudo yum install -y amazon-efs-utils

        Step 5.4: Create mount directory:
          sudo mkdir /efs

        Step 5.5: Mount EFS:
          sudo mount -t efs <EFS-ID>:/ /efs
          (Replace <EFS-ID> with your actual EFS ID, e.g. fs-0abc1234)

        Step 5.6: Verify mount:
          df -h
          cd /efs

        ── Repeat SAME steps (5.1–5.6) on EC2-2 ──

      ──────────

      PART 6: VERIFY SHARED FILESYSTEM

        On EC2-1:
          cd /efs
          sudo nano h.txt
          (type any text, e.g. "Hello from EC2-1", save with Ctrl+X → Y → Enter)

        On EC2-2:
          cd /efs
          cat h.txt
          → The file and content appear here (shared filesystem ✓)

        Note: Both EC2s share the same EFS, so files written on one
              are instantly visible on the other.

      ──────────

      PART 7: MAKE IT PERMANENT (Survive Reboots)

        Run on BOTH EC2-1 and EC2-2:

          sudo nano /etc/fstab

        Add this line at the end of the file:
          <EFS-ID>:/ /efs efs defaults,_netdev 0 0

        Save and exit (Ctrl+X → Y → Enter), then verify:
          sudo mount -a
          df -h   ← /efs should appear in the list
    `,
  },
  {
    id: "s3",
    title: "S3",
    content: 
    `
      a) Public Access to S3 Object
        Step 1: Create an S3 bucket, allow ACLs under Object Ownership.
        Step 2: Block all public access → UNCHECK it (very important).
        Step 3: Enable versioning (recommended).
        Step 4: After creation:
                Bucket → Permissions → ACL → Public Access → right side tick.
        Step 5: Upload any image → click on it
                Permissions → ACL → Public Access → left AND right tick.
        Step 6: Properties → Copy link → open in incognito to verify.

      ──────────

      b) Versioning
        Step 1: Enable versioning (compulsory).
        Step 2: Upload a text file, modify it locally, upload again.
        Step 3: Buckets → Objects → click "Show Versions"
                → you can see both versions.
        Step 4: Delete the latest version → old version still shows.

      ──────────

      c) Cross Region Replication
        Step 1: Create a 2nd bucket in a DIFFERENT region
                (same process, versioning enabled).
        Step 2: Go to 1st bucket → Management → Replication Rules.
        Step 3: Status: Enable
                Source: Apply to all objects
                Destination: select the 2nd bucket
                IAM Role: LabRole
                Replicate existing objects: No
        Step 4: Upload any file in bucket 1
                → it automatically appears in bucket 2.

      ──────────

      d) Static Website Hosting
        Step 1: Upload index.html and error.html following the
                normal public access process (ACL settings enabled).
        Step 2: Click on index.html → Permissions → Everyone → both ticks.
                Do the same for error.html.
        Step 3: Bucket → Properties → Static Website Hosting → Enable.
                Enter: index.html as index document, error.html as error document.
        Step 4: Copy the generated URL → open in browser.
    `,
  },
  {
    id: "vpc",
    title: "VPC",
    content: 
    `
      Step 1: Create a VPC — CIDR: 10.0.0.0/16

      Step 2: Create Subnets:
        Public:  AZ us-east-1a | Subnet CIDR: 10.0.1.0/24
        Private: AZ us-east-1a | Subnet CIDR: 10.0.2.0/24

      Step 3: Create an Internet Gateway → Attach to the VPC.

      Step 4: Create Route Tables:
        PUBLIC Route Table:
          Create → Actions → Edit Routes
          Add Route: Destination: 0.0.0.0/0, Target: Internet Gateway (custom)
          Actions → Edit Subnet Associations → add Public Subnet.

        PRIVATE Route Table:
          Create → Actions → Edit Subnet Associations → add Private Subnet.

      Step 5: Public Subnet → Actions → Edit Subnet Settings
              → Enable Auto-assign public IPv4 address (tick).

      Step 6: Create a Security Group (attach to the custom VPC):
              Inbound rules: SSH, HTTP, HTTPS.

      Step 7: Create EC2 for Public Subnet:
              Edit Network → VPC (custom)
              Subnet: public
              Select existing security group: custom made.

      Step 8: Create EC2 for Private Subnet (same process, select private subnet).

      Step 9: Test connectivity:
              Public subnet EC2 → will connect ✓
              Private subnet EC2 → will NOT connect ✗ (no internet route)
    `,
  },
  {
    id: "bastion",
    title: "VPC Bastion Server",
    content: 
      `
      (Follow same process as VPC Exp-5 until route tables are created, then continue:)

      Step 1:  Allocate an Elastic IP.
      Step 2:  Create a NAT Gateway:
               Method of Elastic IP: Manual
               Select the created Elastic IP.
      Step 3:  Attach the NAT Gateway to the PRIVATE Route Table.
      Step 4:  Create 2 EC2 instances — one for Public subnet, one for Private subnet.

      Step 5:  Open a terminal where your .pem key is located.
               SSH into the PUBLIC EC2:
                 ssh -i "key.pem" ec2-user@<public-ip>

      Step 6:  Open ANOTHER terminal and copy the key to the public EC2:
                 scp -i yourkey.pem yourkey.pem ec2-user@<public-ip>:~

      Step 7:  In Terminal 1 (inside public EC2), restrict key permissions:
                 chmod 400 yourkey.pem

      Step 8:  From Terminal 1 (inside public EC2), SSH into the PRIVATE EC2:
                 ssh -i yourkey.pem ec2-user@<private-ip>

      Step 9:  After connection success, verify internet access via NAT:
                 ping google.com
      `,
  },
  {
    id: "nat",
    title: "VPC NAT Gateway",
    content: `
      Note: NAT Gateway is part of the Bastion Server experiment.
            Refer to "VPC Bastion Server" for full setup steps.

      Summary:
      Step 1: Allocate Elastic IP.
      Step 2: Create NAT Gateway → attach to Public Subnet → assign Elastic IP.
      Step 3: Edit Private Route Table:
              Add Route: 0.0.0.0/0 → Target: NAT Gateway.
      Step 4: SSH into private EC2 via bastion (public EC2).
      Step 5: Test internet access:
                ping google.com   ← should succeed via NAT`,
  },
  {
    id: "lambda",
    title: "AWS Lambda + S3-DynamoDB Integration",
    content: `
      PART A — Basic Lambda Function

        Step 1: Open AWS Lambda → Create function
        Step 2: Select "Author from scratch"
        Step 3: Name: MyFirstLambda | Runtime: Python 3.x
        Step 4: Role → Select LabRole
        Step 5: Code:

          def lambda_handler(event, context):
              return "Hello AWS Lambda"

        Step 6: Click Deploy → Test

      ──────────

      PART B — S3 → DynamoDB via Lambda

        Step 1: Create an S3 bucket normally.
        Step 2: Create a DynamoDB table:
                Table name: (any name, e.g. s3-events-table)
                Partition key: id   (String)
        Step 3: Create a Lambda function:
                Author from scratch
                Role: LabRole
                Runtime: Python 3.x
        Step 4: Add trigger to Lambda:
                Trigger config: Select S3 → select the bucket.
        Step 5: Lambda code:

          import boto3
          from uuid import uuid4

          def lambda_handler(event, context):

              dynamodb = boto3.resource('dynamodb')

              if 'Records' in event:

                  for record in event['Records']:

                      bucket_name = record['s3']['bucket']['name']
                      object_key = record['s3']['object']['key']
                      size = record['s3']['object'].get('size', -1)
                      event_name = record.get('eventName', 'Unknown')
                      event_time = record.get('eventTime', 'Unknown')

                      table = dynamodb.Table('newtable')

                      table.put_item(
                          Item={
                              'unique': str(uuid4()),
                              'Bucket': bucket_name,
                              'Object': object_key,
                              'Size': size,
                              'Event': event_name,
                              'EventTime': event_time
                          }
                      )

              return {
                  'statusCode': 200,
                  'body': 'Data inserted into DynamoDB'
              }
        Step 6: Click Deploy.
        Step 7: Upload something to the S3 bucket.
        Step 8: Go to DynamoDB → Explore Items → click Run.
                You should see the uploaded file's metadata as a new record.
        Step 9: In Lambda → Monitor → View CloudWatch Logs (to show logs if asked).
    `,
  },
  {
    id: "sns-sqs",
    title: "SNS and SQS",
    content: `
    1) SNS — Create Topic & Send to Email
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
      Step 4: Properties → S3 Event Notification → All object create → SNS
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
          {
            "Statement": [
                {
                "Effect": "Allow",
                "Principal": {
                    "Service": "sns.amazonaws.com"
                },
                "Action": "sqs:SendMessage",
                "Resource": "SQS ARN",
                "Condition": {
                    "ArnEquals": {
                    "aws:SourceArn": "SNS ARN"
                    }
                }
                }
            ]
          }
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
    content: `
      Step 1: Login → AWS Academy → Learner Lab → Open Console.
      Step 2: All Services → Compute → Elastic Beanstalk.
      Step 3: Create Application → Enter a name.
      Step 4: Create Environment → Web server environment.
      Step 5: Platform: Tomcat.
      Step 6: Upload application code (WAR file):
              Download sample WAR from:
              https://tomcat.apache.org/tomcat-6.0-doc/appdev/sample/
              Upload the .war file.
      Step 7: Configure:
              Role: LabRole
              Key pair: select existing
              Network: VPC (default)
              Subnets: select
              Enable public IP: yes
              Instance type: t2.micro   ← important, other types may fail
              Type: Load Balancer | Min: 1 | Max: 2
      Step 8: Create → wait 5–7 minutes.
              AWS will: provision EC2, install Tomcat, deploy the WAR app.
      Step 9: Open the provided domain URL → you should see the sample app.
      Step 10: To redeploy:
               Upload & Deploy → upload same WAR with a different version label
               → open URL again to verify new deployment.
    `,
  },
  {
    id: "lex",
    title: "Amazon Lex",
    content: `
      Step 1: Open Lex → Create bot → Name (everything default).

      Step 2: Intent → Create → Name it (e.g. BookHotel).
              Add utterances:
                "I want to book a hotel"
                "Book a room"
                "Reserve hotel"
                "I need a room"

      Step 3: Create Slots:
        Slot 1 — age (AMAZON.Number)
                 Prompt: "What is your age?"
                 Advanced → Branch:
                   if {age} < 18 → message: "You are not eligible"

        Slot 2 — city (AMAZON.City)
                 Prompt: "Which city would you like to book in?"

        Slot 3 — date (AMAZON.Date)
                 Prompt: "What is your check-in date?"

        Slot 4 — nights (AMAZON.Number)
                 Prompt: "How many nights will you stay?"

      Step 4: Create Custom Slot Type for Room:
              Slot types → Add slot type → Add blank slot type
              Name: RoomType
              Values: single, double, suite

      Step 5: Add Slot — RoomType
              Advanced → Slot prompts → More prompt options
              → Add → Add card groups → add buttons (Single / Double / Suite).

      Step 6: Initial Response:
              "Welcome to Hotel Booking! What is your name?"

      Step 7: Confirmation prompt:
              "Do you want to confirm booking in {city} for {nights} nights?"

      Step 8: Build → Test.

      Sample Conversation:
        User: Book a hotel    → Bot: What is your age?
        User: 25              → Bot: Which city?
        User: Hyderabad       → Bot: Check-in date?
        User: Tomorrow        → Bot: How many nights?
        User: 2               → Bot: Select room type (buttons shown)
        User: Double          → Bot: Confirm booking in Hyderabad for 2 nights?
        User: Yes             → Bot: Booking confirmed!
    `,
  },
  {
    id: "iam",
    title: "IAM",
    content: 
    `
      Part A — GUI Access (Management Console)
        Step 1:  IAM → Users → Create user
        Step 2:  Username: (any, e.g. S3_Specialist)
                 Tick: "Provide user access to the AWS Management Console"
                 Set a custom password.
        Step 3:  Attach policies directly → AmazonS3FullAccess
        Step 4:  Review → Create → Download .csv
                 (contains password + sign-in URL)
        Step 5:  Copy 12-digit Account ID → Sign out.

        Verification (Login as IAM User):
        Step 6:  Open sign-in URL from .csv.
        Step 7:  Enter: Account ID | Username | Password.
        Step 8:  Test 1 (Fail): Go to EC2 → Access Denied ✗
                 Test 2 (Pass): Go to S3 → Create bucket → Works ✓

      ──────────

      Part B — CLI Access (Programmatic)

        Step 1:  Login as Admin → IAM → Users → Select user
        Step 2:  Security credentials → Access keys → Create access key
        Step 3:  Select: Command Line Interface (CLI)
        Step 4:  Download .csv (Access Key ID + Secret Access Key)
        Step 5:  Open Terminal → Run:
                   aws configure
        Step 6:  Enter:
                   Access Key ID:     (from .csv)
                   Secret Access Key: (from .csv)
                   Default region:    ap-south-1
                   Default output:    json

        Verification:
          aws s3 ls              → Lists S3 buckets ✓
          aws s3 mb s3://bucket  → Creates bucket ✓
          aws iam list-users     → AccessDenied ✗
    `,
  },
  {
    id: "iam-roles",
    title: "IAM Roles",
    content: 
    `
        Objective: Allow EC2 to access S3 without storing access keys.
          Step 1: IAM → Roles → Create role
                  Trusted entity: AWS Service | Use case: EC2 → Next
          Step 2: Search: AmazonS3FullAccess → Select → Next
          Step 3: Role name: EC2-S3-Role → Create role
          Step 4: EC2 Dashboard → Select running instance
                  Actions → Security → Modify IAM role
                  Select: EC2-S3-Role → Update
          Step 5: SSH into instance and verify:

            aws s3 ls                 → ✓ Works (S3 allowed)
            aws ec2 describe-instances → ✗ Unauthorized
    `,
  },
];

// ── Download button strip shown inside Beanstalk section ─────────────────────
function BeanstalkDownloads() {
  const [clicked, setClicked] = useState(null);

  const handle = (key) => {
    setClicked(key);
    downloadZip(key);
    setTimeout(() => setClicked(null), 1500);
  };

  const entries = [
    { key: "package", icon: "📦", label: "package.zip", sub: "Node.js app  ·  server.js + package.json + package-lock.json" },
    { key: "basic",   icon: "📄", label: "basic-node-eb-app.zip", sub: "Node.js app  ·  server.js + package.json" },
    { key: "styled",  icon: "🎨", label: "styled-node-eb-app.zip", sub: "Node.js app with HTML  ·  server.js + package.json + public/index.html" },
  ];

  return (
    <div style={{ marginTop: "18px", borderTop: "1px dashed #ccc", paddingTop: "14px" }}>
      <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#888", marginBottom: "10px", letterSpacing: "0.05em" }}>
        ↓ DOWNLOAD APP BUNDLES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {entries.map(({ key, icon, label, sub }) => (
          <button
            key={key}
            onClick={() => handle(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: clicked === key ? "#f0f0f0" : "#fafafa",
              border: "1px solid #d0d0d0",
              borderRadius: "4px",
              padding: "10px 14px",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.background = "#f5f5f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d0d0d0"; e.currentTarget.style.background = clicked === key ? "#f0f0f0" : "#fafafa"; }}
          >
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#000", fontWeight: "600" }}>
                {clicked === key ? "✓ downloading…" : label}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#888", marginTop: "2px" }}>
                {sub}
              </div>
            </div>
            <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "12px", color: "#aaa" }}>
              {clicked === key ? "" : "↓"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section accordion ─────────────────────────────────────────────────────────
function Section({ section, idx }) {
  const [open, setOpen] = useState(false);
  const isBeanstalk = section.id === "beanstalk";

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
        <div
          style={{
            marginTop: "10px",
            background: "#f7f7f7",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            padding: "16px",
          }}
        >
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#000",
              margin: 0,
              textAlign: "left",
            }}
          >
            {section.content}
          </pre>
          {isBeanstalk && <BeanstalkDownloads />}
        </div>
      )}
    </div>
  );
}

// ── Upload banner (unchanged) ─────────────────────────────────────────────────
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
        <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#555" }}>📦</span>
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

// ── Root ──────────────────────────────────────────────────────────────────────
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
        <DownloadBanner zipFile={zipFile} onUpload={handleUpload} onRemove={handleRemove} />

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
      </div>
    </div>
  );
}