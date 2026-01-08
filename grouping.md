1. System Administration (Core Linux & System Management)

System Information & Navigation

Basic Linux exploration: uname, hostnamectl, uptime, top, htop, df, du, ls, cd, pwd, tree

File Operations

Creating files: touch, echo, cat > filename

Copying/moving files: cp, mv, rsync

Finding files: find, locate, which, whereis

Text Editors

Vim: modes, navigation, editing, saving, search/replace

Nano: basic editing, search, saving

File Permissions

chmod, chown, chgrp

ACLs: getfacl, setfacl

File attributes: lsattr, chattr

User & Group Management

Create/modify/delete users and groups: useradd, usermod, userdel, groupadd, groupmod, groupdel

Password management: passwd, chage

User info: id, groups, /etc/passwd, /etc/group

Process Management

View processes: ps, top, htop

Controlling processes: kill, pkill, killall, nice, renice

Background & foreground jobs: jobs, bg, fg

systemd Service Management

Managing services: systemctl start/stop/restart/status

Enable/disable services: systemctl enable/disable

Inspect system state: systemctl is-active, systemctl list-units

Package Management

RPM packages: rpm -ivh, rpm -q, rpm -Uvh

DNF/YUM: dnf install/remove/update, yum repolist, yum history

System Logging

Syslog: rsyslog, log files /var/log/messages, /var/log/syslog

Journalctl: view logs, filter by service or time

Auditd: auditctl, ausearch, aureport

Disk Management

Partitioning: fdisk, parted

LVM: pvcreate, vgcreate, lvcreate, lvextend

Filesystems: mkfs, tune2fs, xfs_growfs

Mounting: mount, umount, /etc/fstab

Networking Basics

IP configuration: ip addr, ifconfig

Routing: ip route, route

Connectivity testing: ping, traceroute, curl, dig

Firewall Management

Firewalld: firewall-cmd --list-all, zones, permanent rules

iptables basics: chains, rules, NAT

SSH

Connecting: ssh user@host

Keys: ssh-keygen, ssh-copy-id

Tunneling & port forwarding

Secure copy: scp

Secure file transfer: sftp

Text Processing

grep, egrep, fgrep

sed for stream editing

awk for field extraction and processing

cut, sort, uniq, wc, tr

Bash Scripting

Variables, loops (for, while), conditionals (if, case)

Functions, arrays, reading input

Script best practices for automation

Backup & Recovery

tar, rsync, dd

Database backup strategies (MySQL, PostgreSQL)

Automation

cron jobs, at scheduling

systemd timers

Miscellaneous

Compression: gzip, bzip2, xz, zip/unzip

System info: lscpu, free, uptime

Calculators: bc, expr

Terminal multiplexers: tmux, screen

Useful One-Liners

Quick references for daily sysadmin tasks

1. DevOps Tools (CI/CD, Containers, Cloud & Configuration Management)

Python for DevOps

pip package management

Virtual environments: venv, virtualenv

Git Version Control

Cloning, commits, branches, merging, rebasing

Git workflows, stash, reset, diff, log

Docker

Containers: docker run, docker ps, docker exec

Images: docker build, docker pull, docker push

Volumes: docker volume create, mounting

Networks: docker network create, bridge, overlay

Kubernetes

kubectl: manage pods, deployments, services, namespaces

ConfigMaps, secrets, scaling, rolling updates

Understanding cluster vs node vs pod

Ansible

Playbooks, roles, inventory

Modules: yum, copy, template, service

Running ad-hoc commands, idempotency

Terraform

Infrastructure as Code: providers, resources, modules

terraform init/plan/apply/destroy

State management

AWS CLI

Managing EC2, S3, IAM, RDS

Profile and region configuration

Automation via scripts

Automation One-Liners

Shell + cloud + configuration management quick tasks

1. Monitoring & Security

Monitoring

Prometheus: node exporters, alert rules

Grafana: dashboards, visualization

ELK stack: Elasticsearch, Logstash, Kibana, Beats

Security

fail2ban: protection against brute force

SELinux: enforcing, permissive, contexts

OpenSSL: certificate creation, validation

GPG: encryption, signing, key management

Vulnerability scanning: nmap, lynis, ossec

Performance Monitoring & Tuning

Tools: iostat, vmstat, sar

CPU, memory, disk I/O, network monitoring

Kernel tuning: sysctl

Backup & Recovery (Security Perspective)

Encrypted backups, verification, offsite copies

This categorization separates your learning into practical sysadmin skills, DevOps & automation, and monitoring/security, which aligns perfectly with RHCSA → RHCE → DevOps engineer → cloud engineer career progression.
