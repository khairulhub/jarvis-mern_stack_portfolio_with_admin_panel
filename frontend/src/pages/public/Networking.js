import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   NETWORK TOPICS DATA
═══════════════════════════════════════════════════════ */
const NET_SKILLS = [
  { name: "Cisco Routing & Switching", pct: 90 },
  { name: "VLAN / Inter-VLAN Routing",  pct: 88 },
  { name: "Firewall / ACL",            pct: 82 },
  { name: "Mikrotik RouterOS",         pct: 85 },
  { name: "TCP/IP & OSI Model",        pct: 92 },
  { name: "Network Security",          pct: 78 },
];

const topics = [
  /* ── 1. ROUTER CONFIG ──────────────────────────────── */
  {
    id: 1,
    icon: "ti-router",
    emoji: "🔀",
    accentColor: "#00e5ff",
    accentBg: "rgba(0,229,255,0.08)",
    accentBorder: "rgba(0,229,255,0.25)",
    category: "CISCO",
    title: "ROUTER CONFIG",
    subtitle: "Basic to Advanced — VLAN, OSPF, Traffic Control",
    shortDesc: "Complete router configuration from hostname setup to advanced OSPF, VLAN routing, ACL, and traffic shaping in real-life ISP/enterprise deployments.",
    diagram: `
┌─────────────────────────────────────────────────────┐
│              ENTERPRISE ROUTER TOPOLOGY             │
│                                                     │
│  [Internet/ISP]──────[WAN Gi0/0]                   │
│                           │                         │
│                      [ROUTER R1]                    │
│                      192.168.0.1                    │
│                    ┌──────┴──────┐                  │
│               [LAN Gi0/1]  [LAN Gi0/2]              │
│               192.168.1.0  192.168.2.0              │
│                    │             │                  │
│             [SALES VLAN10] [IT VLAN20]              │
│              .1-.50           .1-.50                │
└─────────────────────────────────────────────────────┘`,
    steps: [
      {
        title: "1. Basic Setup",
        desc: "Set hostname, disable DNS lookup, configure enable secret and console passwords.",
        code: `Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# no ip domain-lookup
R1(config)# enable secret Cisco123
R1(config)# line console 0
R1(config-line)# password Cisco123
R1(config-line)# login
R1(config-line)# logging synchronous
R1(config-line)# exit
R1(config)# service password-encryption
R1(config)# banner motd #AUTHORIZED ACCESS ONLY#`,
      },
      {
        title: "2. Interface Configuration",
        desc: "Configure WAN and LAN interfaces with IP addresses.",
        code: `! WAN Interface (to ISP)
R1(config)# interface GigabitEthernet0/0
R1(config-if)# description WAN_TO_ISP
R1(config-if)# ip address 203.0.113.2 255.255.255.252
R1(config-if)# no shutdown

! LAN Interface
R1(config)# interface GigabitEthernet0/1
R1(config-if)# description LAN_SALES
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown

! Sub-interface for VLAN routing
R1(config)# interface GigabitEthernet0/1.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0

R1(config)# interface GigabitEthernet0/1.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0`,
      },
      {
        title: "3. OSPF Routing",
        desc: "Configure OSPF dynamic routing protocol for multi-area deployment.",
        code: `! Enable OSPF process
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 192.168.2.0 0.0.0.255 area 0
R1(config-router)# network 203.0.113.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet0/1
R1(config-router)# default-information originate

! Verification
R1# show ip ospf neighbor
R1# show ip route ospf
R1# show ip protocols`,
      },
      {
        title: "4. NAT / PAT (Internet Access)",
        desc: "Configure NAT overload (PAT) so LAN users can access internet.",
        code: `! Define inside/outside
R1(config)# interface Gi0/0
R1(config-if)# ip nat outside

R1(config)# interface Gi0/1
R1(config-if)# ip nat inside

! Create ACL for NAT
R1(config)# ip access-list standard LAN_NAT
R1(config-std-nacl)# permit 192.168.0.0 0.0.255.255

! Enable PAT
R1(config)# ip nat inside source list LAN_NAT
  interface GigabitEthernet0/0 overload

! Verify
R1# show ip nat translations
R1# show ip nat statistics`,
      },
      {
        title: "5. Traffic Control / QoS",
        desc: "Policy-based routing and traffic shaping for bandwidth management.",
        code: `! Create class-map for VoIP traffic
R1(config)# class-map match-all VOIP
R1(config-cmap)# match protocol rtp

! Create class-map for HTTP
R1(config)# class-map match-all HTTP_TRAFFIC
R1(config-cmap)# match protocol http

! Policy-map with priority queue
R1(config)# policy-map QOS_POLICY
R1(config-pmap)# class VOIP
R1(config-pmap-c)# priority 512
R1(config-pmap)# class HTTP_TRAFFIC
R1(config-pmap-c)# bandwidth 2048
R1(config-pmap)# class class-default
R1(config-pmap-c)# fair-queue

! Apply to interface
R1(config)# interface Gi0/0
R1(config-if)# service-policy output QOS_POLICY`,
      },
      {
        title: "6. Static Routes & Default Route",
        desc: "Add static and default routes for basic routing needs.",
        code: `! Default route to ISP
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Static route to remote network
R1(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.254

! Floating static (backup route)
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.5 5

! Verify
R1# show ip route
R1# ping 8.8.8.8 source 192.168.1.1`,
      },
    ],
  },

  /* ── 2. SWITCH CONFIG ──────────────────────────────── */
  {
    id: 2,
    icon: "ti-switch-horizontal",
    emoji: "🔁",
    accentColor: "#a855f7",
    accentBg: "rgba(168,85,247,0.08)",
    accentBorder: "rgba(168,85,247,0.25)",
    category: "L2/L3",
    title: "SWITCH CONFIG",
    subtitle: "Cisco, Juniper, VSOL, BDCOM — L2 & L3",
    shortDesc: "Layer 2 & Layer 3 switch configuration for VLANs, trunking, STP, port security, and inter-VLAN routing on Cisco, Juniper, VSOL OLT, and BDCOM switches.",
    diagram: `
┌─────────────────────────────────────────────────────┐
│               SWITCH HIERARCHY DESIGN               │
│                                                     │
│         [Core L3 Switch] ── 192.168.0.0/16          │
│          Cisco C3750 / BDCOM S5750                  │
│         ┌────────┴────────┐                         │
│   [Dist SW-1]        [Dist SW-2]                    │
│   VLAN 10,20         VLAN 30,40                     │
│   ┌───┴───┐         ┌───┴───┐                       │
│ [Acc1] [Acc2]    [Acc3] [Acc4]                      │
│  PC1-10 PC11-20  PC21-30 PC31-40                    │
└─────────────────────────────────────────────────────┘`,
    steps: [
      {
        title: "1. Cisco L2 Switch — VLAN Setup",
        desc: "Create VLANs, assign access ports, and configure trunk links on Cisco IOS.",
        code: `! === CISCO IOS L2 SWITCH ===
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1

! Create VLANs
SW1(config)# vlan 10
SW1(config-vlan)# name SALES
SW1(config)# vlan 20
SW1(config-vlan)# name IT_DEPT
SW1(config)# vlan 30
SW1(config-vlan)# name MANAGEMENT
SW1(config)# vlan 99
SW1(config-vlan)# name NATIVE

! Access port assignment
SW1(config)# interface range fa0/1-10
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 10
SW1(config-if-range)# spanning-tree portfast
SW1(config-if-range)# no shutdown

! Trunk uplink to Core
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,30,99`,
      },
      {
        title: "2. Cisco L3 Switch — Inter-VLAN Routing",
        desc: "Enable routing on a Layer 3 switch with SVI interfaces.",
        code: `! === CISCO L3 SWITCH (Core) ===
Core(config)# ip routing

! SVI for each VLAN
Core(config)# interface vlan 10
Core(config-if)# ip address 192.168.10.1 255.255.255.0
Core(config-if)# no shutdown
Core(config-if)# description SALES_GATEWAY

Core(config)# interface vlan 20
Core(config-if)# ip address 192.168.20.1 255.255.255.0
Core(config-if)# no shutdown
Core(config-if)# description IT_GATEWAY

! DHCP pools on L3 switch
Core(config)# ip dhcp pool SALES_POOL
Core(dhcp-config)# network 192.168.10.0 255.255.255.0
Core(dhcp-config)# default-router 192.168.10.1
Core(dhcp-config)# dns-server 8.8.8.8

Core(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10

! Verify
Core# show ip route
Core# show vlan brief`,
      },
      {
        title: "3. Port Security",
        desc: "Restrict MAC addresses per port to prevent unauthorized access.",
        code: `! Enable port security on access ports
SW1(config)# interface range fa0/1-24
SW1(config-if-range)# switchport port-security
SW1(config-if-range)# switchport port-security maximum 2
SW1(config-if-range)# switchport port-security mac-address sticky
SW1(config-if-range)# switchport port-security violation restrict

! BPDU Guard (prevent rogue switches)
SW1(config-if-range)# spanning-tree bpduguard enable
SW1(config-if-range)# spanning-tree portfast

! Check security status
SW1# show port-security interface fa0/1
SW1# show port-security address`,
      },
      {
        title: "4. Juniper EX Switch",
        desc: "Basic VLAN and trunk configuration on Juniper EX series.",
        code: `# === JUNIPER EX SWITCH ===
# Configure VLAN
set vlans SALES vlan-id 10
set vlans IT_DEPT vlan-id 20
set vlans MANAGEMENT vlan-id 30

# Access port
set interfaces ge-0/0/1 unit 0 family ethernet-switching
  interface-mode access
set interfaces ge-0/0/1 unit 0 family ethernet-switching
  vlan members SALES

# Trunk port
set interfaces ge-0/0/48 unit 0 family ethernet-switching
  interface-mode trunk
set interfaces ge-0/0/48 unit 0 family ethernet-switching
  vlan members [SALES IT_DEPT MANAGEMENT]

# L3 SVI
set interfaces irb unit 10 family inet address 192.168.10.1/24
set vlans SALES l3-interface irb.10

# Commit
commit check
commit`,
      },
      {
        title: "5. BDCOM / VSOL OLT Switch",
        desc: "BDCOM S5750 and VSOL OLT VLAN configuration for ISP use.",
        code: `! === BDCOM S5750 L3 SWITCH ===
enable
configure terminal
hostname BDCOM-CORE

! Create VLAN
vlan 10
 name INTERNET_USERS
vlan 20
 name IPTV_USERS
vlan 100
 name MANAGEMENT

! OLT Uplink (trunk)
interface GigabitEthernet 1/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,100

! PON service VLAN
interface GigabitEthernet 1/2
 switchport mode access
 switchport access vlan 10

! === VSOL OLT VLAN CONFIG ===
! PON port binding
pon-olt 0/1
 service-port 1 vlan 10 gemport 0 multi-service
   user-vlan 100 tag-transform translate
 service-port 2 vlan 20 gemport 1 multi-service
   user-vlan 200 tag-transform translate`,
      },
      {
        title: "6. STP & EtherChannel",
        desc: "Spanning Tree Protocol and link aggregation for redundancy.",
        code: `! Set spanning tree mode
SW1(config)# spanning-tree mode rapid-pvst
SW1(config)# spanning-tree vlan 10 priority 4096
SW1(config)# spanning-tree vlan 20 priority 8192

! EtherChannel (LACP) — link aggregation
SW1(config)# interface range GigabitEthernet0/1-2
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit

SW1(config)# interface port-channel 1
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan all

! Verify
SW1# show spanning-tree vlan 10
SW1# show etherchannel summary`,
      },
    ],
  },

  /* ── 3. FIREWALL / ACL ─────────────────────────────── */
  {
    id: 3,
    icon: "ti-shield-lock",
    emoji: "🔒",
    accentColor: "#f87171",
    accentBg: "rgba(239,68,68,0.08)",
    accentBorder: "rgba(239,68,68,0.25)",
    category: "SECURITY",
    title: "FIREWALL / ACL",
    subtitle: "Cisco ASA, Zone-Based, Extended ACL, DMZ",
    shortDesc: "Enterprise firewall design with Cisco ASA, zone-based policies, extended ACLs, NAT, DMZ architecture, and intrusion detection for real-world security deployments.",
    diagram: `
┌─────────────────────────────────────────────────────┐
│              FIREWALL DMZ ARCHITECTURE              │
│                                                     │
│  [INTERNET] ── (OUTSIDE) ── [ASA FW] ── (INSIDE)   │
│                                  │                  │
│                              (DMZ zone)             │
│                         ┌────────┴────────┐         │
│                    [Web Server]    [Mail Server]     │
│                    10.0.1.10       10.0.1.20         │
│                                                     │
│  Security Levels:                                   │
│  INSIDE  = 100  (most trusted)                      │
│  DMZ     = 50   (semi-trusted)                      │
│  OUTSIDE = 0    (untrusted)                         │
└─────────────────────────────────────────────────────┘`,
    steps: [
      {
        title: "1. Cisco ASA Basic Setup",
        desc: "Initial ASA configuration — interface security levels, zones, and management.",
        code: `! === CISCO ASA FIREWALL ===
ASA> enable
ASA# configure terminal
ASA(config)# hostname FW1

! Outside interface (ISP)
FW1(config)# interface GigabitEthernet0/0
FW1(config-if)# nameif outside
FW1(config-if)# security-level 0
FW1(config-if)# ip address 203.0.113.1 255.255.255.252
FW1(config-if)# no shutdown

! Inside interface (LAN)
FW1(config)# interface GigabitEthernet0/1
FW1(config-if)# nameif inside
FW1(config-if)# security-level 100
FW1(config-if)# ip address 192.168.1.1 255.255.255.0
FW1(config-if)# no shutdown

! DMZ interface
FW1(config)# interface GigabitEthernet0/2
FW1(config-if)# nameif dmz
FW1(config-if)# security-level 50
FW1(config-if)# ip address 10.0.1.1 255.255.255.0
FW1(config-if)# no shutdown`,
      },
      {
        title: "2. NAT on ASA",
        desc: "Configure PAT for internet access and static NAT for DMZ servers.",
        code: `! Dynamic PAT — LAN to Internet
FW1(config)# object network LAN_NETWORK
FW1(config-network-object)# subnet 192.168.1.0 255.255.255.0
FW1(config-network-object)# nat (inside,outside) dynamic interface

! Static NAT — Web Server in DMZ
FW1(config)# object network WEB_SERVER
FW1(config-network-object)# host 10.0.1.10
FW1(config-network-object)# nat (dmz,outside) static 203.0.113.10

! Static NAT — Mail Server
FW1(config)# object network MAIL_SERVER
FW1(config-network-object)# host 10.0.1.20
FW1(config-network-object)# nat (dmz,outside) static 203.0.113.20

! Verify
FW1# show nat
FW1# show xlate`,
      },
      {
        title: "3. Extended ACL (Cisco IOS Router)",
        desc: "Granular traffic filtering with named extended access-control lists.",
        code: `! === EXTENDED ACL on IOS ROUTER ===
! Allow HTTP/HTTPS to web server only
R1(config)# ip access-list extended OUTSIDE_IN
R1(config-ext-nacl)# remark Allow web traffic to DMZ
R1(config-ext-nacl)# permit tcp any host 203.0.113.10 eq 80
R1(config-ext-nacl)# permit tcp any host 203.0.113.10 eq 443
R1(config-ext-nacl)# permit tcp any host 203.0.113.20 eq 25
R1(config-ext-nacl)# permit tcp any host 203.0.113.20 eq 587
R1(config-ext-nacl)# deny ip any any log

! Allow LAN to internet
R1(config)# ip access-list extended INSIDE_OUT
R1(config-ext-nacl)# permit ip 192.168.0.0 0.0.255.255 any
R1(config-ext-nacl)# deny ip any any log

! Apply to interfaces
R1(config)# interface Gi0/0
R1(config-if)# ip access-group OUTSIDE_IN in
R1(config)# interface Gi0/1
R1(config-if)# ip access-group INSIDE_OUT in

! Verify
R1# show ip access-lists`,
      },
      {
        title: "4. Zone-Based Firewall (ZBF)",
        desc: "Modern IOS zone-based firewall replacing classic ACLs with policy maps.",
        code: `! Define zones
R1(config)# zone security INSIDE
R1(config)# zone security OUTSIDE
R1(config)# zone security DMZ

! Class-map for HTTP traffic
R1(config)# class-map type inspect match-any HTTP_APPS
R1(config-cmap)# match protocol http
R1(config-cmap)# match protocol https
R1(config-cmap)# match protocol dns

! Policy-map INSIDE → OUTSIDE
R1(config)# policy-map type inspect IN_TO_OUT
R1(config-pmap)# class HTTP_APPS
R1(config-pmap-c)# inspect

! Zone-pair — apply policy
R1(config)# zone-pair security IN_OUT
  source INSIDE destination OUTSIDE
R1(config-sec-zone-pair)# service-policy type inspect IN_TO_OUT

! Assign interfaces to zones
R1(config)# interface Gi0/0
R1(config-if)# zone-member security OUTSIDE
R1(config)# interface Gi0/1
R1(config-if)# zone-member security INSIDE`,
      },
      {
        title: "5. ASA Access Rules (ASDM-style CLI)",
        desc: "Define granular access control rules between ASA security zones.",
        code: `! Allow INSIDE → OUTSIDE (already allowed by security level)
! Restrict DMZ → INSIDE (DMZ cannot initiate to LAN)
FW1(config)# access-list DMZ_TO_IN extended deny ip
  10.0.1.0 255.255.255.0 192.168.1.0 255.255.255.0
FW1(config)# access-list DMZ_TO_IN extended permit ip any any
FW1(config)# access-group DMZ_TO_IN in interface dmz

! Allow OUTSIDE → DMZ specific services
FW1(config)# access-list OUT_TO_DMZ extended permit tcp
  any host 10.0.1.10 eq 80
FW1(config)# access-list OUT_TO_DMZ extended permit tcp
  any host 10.0.1.10 eq 443
FW1(config)# access-list OUT_TO_DMZ extended deny ip any any log
FW1(config)# access-group OUT_TO_DMZ in interface outside

! Syslog
FW1(config)# logging enable
FW1(config)# logging host inside 192.168.1.100
FW1(config)# logging trap warnings`,
      },
      {
        title: "6. Intrusion Prevention (IPS/IDS)",
        desc: "Configure Cisco IOS IPS for signature-based threat detection.",
        code: `! Enable IPS on router
R1(config)# ip ips name EDGE_IPS

! Create IPS rule for inbound traffic
R1(config)# ip ips name EDGE_IPS list EDGE_ACL

! Assign to interface
R1(config)# interface Gi0/0
R1(config-if)# ip ips EDGE_IPS in

! Configure IPS signatures
R1(config)# ip ips signature-definition
R1(config-sigdef)# signature 2004 0
R1(config-sig)# status
R1(config-sig-status)# retired false
R1(config-sig-status)# enabled true
R1(config-sig)# engine atomic-ip
R1(config-sig-ete)# event-action produce-alert
R1(config-sig-ete)# event-action deny-packet-inline

! Verify
R1# show ip ips all
R1# show ip ips statistics`,
      },
    ],
  },

  /* ── 4. MIKROTIK ───────────────────────────────────── */
  {
    id: 4,
    icon: "ti-server",
    emoji: "⚙️",
    accentColor: "#00ff88",
    accentBg: "rgba(0,255,136,0.08)",
    accentBorder: "rgba(0,255,136,0.25)",
    category: "MIKROTIK",
    title: "MIKROTIK",
    subtitle: "RouterOS — ISP Setup, VLAN, Firewall, Hotspot",
    shortDesc: "Full Mikrotik RouterOS configuration for real ISP deployments — PPPoE server, DHCP, firewall, bandwidth management, hotspot, and MTCNA/MTCRE level configs.",
    diagram: `
┌─────────────────────────────────────────────────────┐
│             MIKROTIK ISP TOPOLOGY                   │
│                                                     │
│  [OLT/Fiber] ── ether1 [MikroTik RB4011] ether2 ── │
│                          (RouterOS 7.x)             │
│                         ┌───────┴────────┐          │
│                  [ether3-VLAN10]  [ether4-VLAN20]   │
│                  PPPoE Clients    Corporate LAN      │
│                  192.168.10.0/24  10.10.10.0/24     │
│                                                     │
│  Hotspot ── wlan1 (2.4G/5G AP)                      │
│  Queue Tree for bandwidth per user                  │
└─────────────────────────────────────────────────────┘`,
    steps: [
      {
        title: "1. Initial Setup & IP Address",
        desc: "Factory reset, set identity, configure WAN and LAN interfaces.",
        code: `# === MIKROTIK INITIAL SETUP (CLI / Terminal) ===

# Set identity
/system identity set name=MK-ISP-01

# WAN Interface (from ISP/OLT)
/ip address add address=203.0.113.2/30
  interface=ether1 comment="WAN_ISP"

# LAN Interface
/ip address add address=192.168.1.1/24
  interface=ether2 comment="LAN_GATEWAY"

# DNS
/ip dns set servers=8.8.8.8,1.1.1.1
  allow-remote-requests=yes

# Default route
/ip route add dst-address=0.0.0.0/0
  gateway=203.0.113.1 comment="DEFAULT_ROUTE"

# NTP
/system ntp client set enabled=yes
  server-dns-names=time.cloudflare.com`,
      },
      {
        title: "2. PPPoE Server (ISP User Auth)",
        desc: "Setup PPPoE server for subscriber authentication — used in real ISP deployments.",
        code: `# === PPPoE SERVER SETUP ===

# Create IP Pool for PPPoE clients
/ip pool add name=pppoe-pool
  ranges=10.10.10.2-10.10.10.254

# PPP Profile
/ppp profile add name=ISP_USERS
  local-address=10.10.10.1
  remote-address=pppoe-pool
  dns-server=8.8.8.8,1.1.1.1
  rate-limit="10M/10M"
  use-compression=no
  use-encryption=no

# PPPoE Server on interface
/interface pppoe-server server add
  service-name=ISP_PPPoE
  interface=ether2
  default-profile=ISP_USERS
  enabled=yes
  one-session-per-host=yes

# Add user (subscriber)
/ppp secret add name=user01
  password=pass123
  service=pppoe
  profile=ISP_USERS
  comment="Customer_01"`,
      },
      {
        title: "3. DHCP Server",
        desc: "Configure DHCP pools for automatic IP assignment per VLAN.",
        code: `# === DHCP SERVER ===

# Create IP Pool
/ip pool add name=dhcp-lan
  ranges=192.168.1.100-192.168.1.200

/ip pool add name=dhcp-vlan10
  ranges=192.168.10.100-192.168.10.200

# DHCP Server for LAN
/ip dhcp-server add name=DHCP_LAN
  interface=ether2
  address-pool=dhcp-lan
  lease-time=12h
  disabled=no

/ip dhcp-server network add
  address=192.168.1.0/24
  gateway=192.168.1.1
  dns-server=8.8.8.8,1.1.1.1
  comment="LAN_NETWORK"

# DHCP Server for VLAN 10
/ip dhcp-server add name=DHCP_VLAN10
  interface=ether3
  address-pool=dhcp-vlan10
  lease-time=24h
  disabled=no

/ip dhcp-server network add
  address=192.168.10.0/24
  gateway=192.168.10.1
  dns-server=8.8.8.8`,
      },
      {
        title: "4. Firewall Rules",
        desc: "Essential firewall chain rules to protect the router and LAN from external threats.",
        code: `# === MIKROTIK FIREWALL ===

# Input chain — protect router itself
/ip firewall filter add chain=input
  action=accept connection-state=established,related
  comment="Accept established"

/ip firewall filter add chain=input
  action=accept protocol=icmp in-interface=ether2
  comment="Allow ping from LAN"

/ip firewall filter add chain=input
  action=accept protocol=tcp dst-port=22,8291
  in-interface=ether2
  comment="Allow SSH & Winbox from LAN"

/ip firewall filter add chain=input
  action=drop in-interface=ether1
  comment="DROP all from WAN"

# Forward chain — protect LAN
/ip firewall filter add chain=forward
  action=accept connection-state=established,related

/ip firewall filter add chain=forward
  action=drop connection-state=invalid

# NAT — masquerade for internet
/ip firewall nat add chain=srcnat
  action=masquerade out-interface=ether1
  comment="Internet NAT"`,
      },
      {
        title: "5. Queue Tree (Bandwidth Management)",
        desc: "Per-user bandwidth limiting with burst — real ISP traffic shaping.",
        code: `# === QUEUE TREE / SIMPLE QUEUE ===

# Simple Queue — per user limit
/queue simple add name=User_01
  target=192.168.1.10/32
  max-limit=10M/10M
  burst-limit=15M/15M
  burst-threshold=7M/7M
  burst-time=15s/15s
  comment="Customer_01_10Mbps"

# Queue Tree — global bandwidth control
/queue type add name=pcq-download
  kind=pcq pcq-rate=5M pcq-classifier=dst-address

/queue type add name=pcq-upload
  kind=pcq pcq-rate=2M pcq-classifier=src-address

/queue tree add name=DOWNLOAD
  parent=global packet-mark=download
  queue=pcq-download max-limit=100M

/queue tree add name=UPLOAD
  parent=global packet-mark=upload
  queue=pcq-upload max-limit=50M`,
      },
      {
        title: "6. Hotspot Setup (WiFi Users)",
        desc: "Configure Mikrotik Hotspot for captive portal authentication on WiFi network.",
        code: `# === HOTSPOT SETUP ===

# Hotspot on wlan1
/ip hotspot setup
  hotspot interface: wlan1
  local address: 172.16.0.1/24
  masquerade network: yes
  address pool: 172.16.0.2-172.16.0.254
  DNS name: hotspot.khairulhub.com

# Hotspot user profile
/ip hotspot user profile add name=FREE_1HR
  shared-users=1
  session-timeout=1h
  idle-timeout=15m
  rate-limit="2M/2M"

/ip hotspot user profile add name=PAID_5MB
  shared-users=1
  rate-limit="5M/5M"
  validity=1d

# Add hotspot users
/ip hotspot user add name=guest01
  password=guest123
  profile=FREE_1HR
  comment="Free trial user"

# Verify
/ip hotspot active print
/ip hotspot host print`,
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   COPY BUTTON COMPONENT
═══════════════════════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 transition-all duration-200"
      style={{
        background: copied ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.07)",
        border: copied ? "1px solid rgba(0,255,136,0.3)" : "1px solid rgba(0,229,255,0.15)",
        color: copied ? "#00ff88" : "#6a9bbf",
        borderRadius: 5,
        padding: "3px 10px",
        fontSize: 10,
        fontFamily: "'Share Tech Mono', monospace",
        cursor: "pointer",
        letterSpacing: 1,
      }}
    >
      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 12 }} />
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   NETWORK MODAL
═══════════════════════════════════════════════════════ */
// function NetworkModal({ topic: t, onClose }) {
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     setActiveStep(0);
//     const handler = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [t, onClose]);

//   const step = t.steps[activeStep];

function NetworkModal({ topic: t, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveStep(0);
    setMobileMenuOpen(false);
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [t, onClose]);

  const step = t.steps[activeStep];

  const goToStep = (i) => {
    setActiveStep(i);
    setMobileMenuOpen(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 900,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "12px",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "min(80vw, 940px)",
          height: "min(90vh, 680px)",
          background: "#080e1a",
          border: `1px solid ${t.accentBorder}`,
          borderRadius: 14,
          boxShadow: `0 0 60px ${t.accentBg}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── top strip ── */}
        <div style={{
          height: 3, flexShrink: 0,
          background: `linear-gradient(90deg,transparent,${t.accentColor},transparent)`,
        }} />

        {/* ── HEADER ── */}
        <div style={{
          flexShrink: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10,
          padding: "12px 16px",
          background: "#04080f",
          borderBottom: "1px solid rgba(0,229,255,0.08)",
        }}>
          {/* left: icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: t.accentBg, border: `1px solid ${t.accentBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              {t.emoji}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{
                fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(11px,2vw,14px)",
                fontWeight: 700, color: t.accentColor, letterSpacing: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {t.title}
              </div>
              <div style={{
                fontSize: "clamp(9px,1.5vw,11px)", color: "#6a9bbf",
                fontFamily: "'Share Tech Mono',monospace", marginTop: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {t.subtitle}
              </div>
            </div>
          </div>

          {/* right: category + mobile step picker + close */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: "2px 8px", borderRadius: 20, fontSize: 9,
              background: t.accentBg, border: `1px solid ${t.accentBorder}`,
              color: t.accentColor, fontFamily: "'Share Tech Mono',monospace",
              whiteSpace: "nowrap",
            }}>
              {t.category}
            </span>

            {/* Mobile step picker button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                background: "rgba(0,229,255,0.06)",
                border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: 6, padding: "5px 10px",
                color: "#00e5ff", cursor: "pointer", fontSize: 10,
                fontFamily: "'Share Tech Mono',monospace",
              }}
              className="mobile-step-btn"
            >
              <i className="ti ti-list" style={{ fontSize: 13 }} />
            </button>

            <button onClick={onClose} style={{
              background: "none", border: "none", color: "#2a4a6a",
              cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2a4a6a")}
            >
              <i className="ti ti-x" />
            </button>
          </div>
        </div>

        {/* ── Mobile step dropdown ── */}
        {mobileMenuOpen && (
          <div style={{
            flexShrink: 0,
            background: "#04080f",
            borderBottom: "1px solid rgba(0,229,255,0.08)",
            maxHeight: 200, overflowY: "auto",
          }}>
            {t.steps.map((s, i) => (
              <button key={i} onClick={() => goToStep(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 16px",
                  background: activeStep === i ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: `3px solid ${activeStep === i ? t.accentColor : "transparent"}`,
                  border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace",
                  background: activeStep === i ? t.accentBg : "transparent",
                  border: `1px solid ${activeStep === i ? t.accentColor : "rgba(0,229,255,0.15)"}`,
                  color: activeStep === i ? t.accentColor : "#2a4a6a",
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: 11, color: activeStep === i ? "#c8e8f8" : "#6a9bbf",
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── BODY: sidebar + detail ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* Desktop sidebar */}
          <div
            className="desktop-sidebar"
            style={{
              width: 195, flexShrink: 0,
              background: "#04080f",
              borderRight: "1px solid rgba(0,229,255,0.07)",
              overflowY: "auto", display: "flex", flexDirection: "column",
            }}
          >
            {t.steps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", width: "100%",
                  background: activeStep === i ? "rgba(0,229,255,0.06)" : "transparent",
                  borderLeft: `3px solid ${activeStep === i ? t.accentColor : "transparent"}`,
                  border: "none",
                  cursor: "pointer", textAlign: "left", flexShrink: 0,
                }}
                onMouseEnter={(e) => { if (activeStep !== i) e.currentTarget.style.background = "rgba(0,229,255,0.03)"; }}
                onMouseLeave={(e) => { if (activeStep !== i) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, fontFamily: "'Share Tech Mono',monospace",
                  background: activeStep === i ? t.accentBg : "transparent",
                  border: `1px solid ${activeStep === i ? t.accentColor : "rgba(0,229,255,0.1)"}`,
                  color: activeStep === i ? t.accentColor : "#2a4a6a",
                  transition: "all 0.2s",
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: 10.5, lineHeight: 1.4,
                  color: activeStep === i ? "#c8e8f8" : "#2a4a6a",
                  fontFamily: "'Share Tech Mono',monospace",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}>
                  {s.title.replace(/^\d+\.\s*/, "")}
                </span>
              </button>
            ))}
          </div>

          {/* ── DETAIL PANEL ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", minWidth: 0 }}>

            {/* step title + copy */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", gap: 8,
              marginBottom: 12, flexWrap: "wrap",
            }}>
              <div style={{
                fontFamily: "'Orbitron',sans-serif",
                fontSize: "clamp(11px,2vw,13px)",
                fontWeight: 700, color: t.accentColor, letterSpacing: 1.5,
              }}>
                {step.title}
              </div>
              <CopyButton text={step.code} />
            </div>

            {/* description box */}
            <p style={{
              fontSize: "clamp(11px,1.8vw,12.5px)", color: "#6a9bbf",
              lineHeight: 1.75, marginBottom: 14,
              padding: "10px 14px",
              background: "rgba(0,229,255,0.03)",
              border: "1px solid rgba(0,229,255,0.07)",
              borderRadius: 7,
            }}>
              {step.desc}
            </p>

            {/* topology diagram — step 0 only */}
            {activeStep === 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 6,
                }}>
                  <span style={{
                    fontSize: 9, color: "#2a4a6a", letterSpacing: 3,
                    fontFamily: "'Share Tech Mono',monospace",
                  }}>
                    // TOPOLOGY DIAGRAM
                  </span>
                  <CopyButton text={t.diagram} />
                </div>
                <pre style={{
                  background: "#020408",
                  border: `1px solid ${t.accentBorder}`,
                  borderRadius: 8, padding: "12px 14px",
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: "clamp(9px,1.5vw,11px)",
                  color: t.accentColor,
                  lineHeight: 1.65, overflowX: "auto",
                  whiteSpace: "pre", maxHeight: 180,
                  overflowY: "auto", margin: 0,
                }}>
                  {t.diagram}
                </pre>
              </div>
            )}

            {/* code block */}
            <div style={{ marginBottom: 14 }}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 6,
              }}>
                <span style={{
                  fontSize: 9, color: "#2a4a6a", letterSpacing: 3,
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  // CONFIGURATION
                </span>
                <CopyButton text={step.code} />
              </div>

              {/* terminal chrome */}
              <div style={{
                borderRadius: 8, overflow: "hidden",
                border: `1px solid ${t.accentBorder}`,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px",
                  background: "#0c1422",
                  borderBottom: "1px solid rgba(0,229,255,0.08)",
                }}>
                  {["#f87171","#facc15","#4ade80"].map((c) => (
                    <div key={c} style={{
                      width: 9, height: 9, borderRadius: "50%",
                      background: c, opacity: 0.8, flexShrink: 0,
                    }} />
                  ))}
                  <span style={{
                    fontSize: 9, color: "#2a4a6a",
                    fontFamily: "'Share Tech Mono',monospace",
                    marginLeft: 6, letterSpacing: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {t.category} — {step.title}
                  </span>
                </div>
                <pre style={{
                  background: "#020408",
                  padding: "14px 16px",
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: "clamp(10px,1.6vw,11.5px)",
                  color: "#00b8cc",
                  lineHeight: 1.8, overflowX: "auto",
                  whiteSpace: "pre-wrap", margin: 0,
                  maxHeight: 260, overflowY: "auto",
                }}>
                  {step.code}
                </pre>
              </div>
            </div>

            {/* prev / next navigation */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(0,229,255,0.07)",
              gap: 8,
            }}>
              <button
                onClick={() => setActiveStep((p) => Math.max(p - 1, 0))}
                disabled={activeStep === 0}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "transparent",
                  border: "1px solid rgba(0,229,255,0.15)",
                  color: activeStep === 0 ? "#1a2a3a" : "#6a9bbf",
                  borderRadius: 6, padding: "7px 16px",
                  fontSize: 10, fontFamily: "'Share Tech Mono',monospace",
                  cursor: activeStep === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                <i className="ti ti-arrow-left" style={{ fontSize: 11 }} /> PREV
              </button>

              {/* step dots */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {t.steps.map((_, i) => (
                  <div key={i} onClick={() => setActiveStep(i)}
                    style={{
                      width: i === activeStep ? 18 : 6,
                      height: 6, borderRadius: 3, cursor: "pointer",
                      background: i === activeStep ? t.accentColor : "rgba(0,229,255,0.12)",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStep((p) => Math.min(p + 1, t.steps.length - 1))}
                disabled={activeStep === t.steps.length - 1}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: activeStep === t.steps.length - 1 ? "transparent" : t.accentBg,
                  border: `1px solid ${activeStep === t.steps.length - 1 ? "rgba(0,229,255,0.15)" : t.accentBorder}`,
                  color: activeStep === t.steps.length - 1 ? "#1a2a3a" : t.accentColor,
                  borderRadius: 6, padding: "7px 16px",
                  fontSize: 10, fontFamily: "'Share Tech Mono',monospace",
                  cursor: activeStep === t.steps.length - 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                NEXT <i className="ti ti-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>

          </div>
          {/* end detail */}
        </div>
        {/* end body */}

      </div>
      {/* end modal box */}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 600px) {
          .desktop-sidebar { display: none !important; }
          .mobile-step-btn { display: flex !important; align-items: center; }
        }
        @media (min-width: 601px) {
          .mobile-step-btn { display: none !important; }
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NETWORKING SECTION
═══════════════════════════════════════════════════════ */
 const Networking = () => {
  const [selected, setSelected] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("fade-visible"); }),
      { threshold: 0.1 }
    );
    const cards = gridRef.current?.querySelectorAll(".net-card");
    cards?.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {selected && <NetworkModal topic={selected} onClose={() => setSelected(null)} />}

      <section id="networking" className="relative z-[2]"
        style={{ background: "#04080f", padding: "80px 0 60px", minHeight: "100vh" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* header */}
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 10 }}>
            // NETWORK.CONFIG
          </div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 26, fontWeight: 700, color: "#00e5ff", letterSpacing: 4, marginBottom: 8 }}>
            NETWORKING
          </div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#00e5ff,transparent)", marginBottom: 36 }} />

          {/* top: 4 topic cards */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {topics.map((t, i) => (
              <div
                key={t.id}
                className="net-card fade-in rounded-xl cursor-pointer transition-all duration-300 flex flex-col overflow-hidden"
                style={{
                  background: "#0c1422",
                  border: "1px solid rgba(0,229,255,0.1)",
                  transitionDelay: `${i * 0.08}s`,
                }}
                onClick={() => setSelected(t)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.accentBorder;
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${t.accentBg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,229,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* top strip */}
                <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${t.accentColor},transparent)` }} />

                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center text-2xl rounded-xl"
                      style={{ width: 50, height: 50, background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
                      {t.emoji}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px]"
                      style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                      {t.category}
                    </span>
                  </div>

                  {/* title */}
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: "#c8e8f8", letterSpacing: 2, marginBottom: 4 }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 10, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1, marginBottom: 10 }}>
                    {t.subtitle}
                  </div>
                  <p style={{ fontSize: 11, color: "#6a9bbf", lineHeight: 1.65, flex: 1, marginBottom: 14 }}>
                    {t.shortDesc}
                  </p>

                  {/* divider */}
                  <div style={{ height: 1, background: "rgba(0,229,255,0.06)", marginBottom: 10 }} />

                  {/* steps count + click hint */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {t.steps.map((_, si) => (
                        <div key={si} style={{ width: 5, height: 5, borderRadius: "50%",
                          background: si === 0 ? t.accentColor : "rgba(0,229,255,0.12)" }} />
                      ))}
                      <span style={{ fontSize: 9, color: "#2a4a6a", fontFamily: "'Share Tech Mono',monospace", marginLeft: 4 }}>
                        {t.steps.length} STEPS
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ fontSize: 9, color: t.accentColor, fontFamily: "'Share Tech Mono',monospace" }}>
                      <i className="ti ti-click" style={{ fontSize: 11 }} /> EXPLORE
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* bottom: skills bars */}
          <div className="rounded-xl p-6" style={{ background: "#0c1422", border: "1px solid rgba(0,229,255,0.08)" }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 3, color: "#2a4a6a", marginBottom: 16 }}>
              // NETWORK.SKILLS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NET_SKILLS.map((s) => (
                <div key={s.name} className="rounded-lg p-3"
                  style={{ background: "#080e1a", border: "1px solid rgba(0,229,255,0.06)" }}>
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 12, color: "#c8e8f8" }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: "#00e5ff", fontFamily: "'Share Tech Mono',monospace" }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#04080f", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${s.pct}%`, height: "100%", borderRadius: 4,
                      background: "linear-gradient(90deg,#00e5ff,#00ff88)",
                      transition: "width 1.2s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Networking;