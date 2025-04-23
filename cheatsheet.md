port forwarding
```powershell
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=172.23.248.8
```

allow inbound
```powershell
New-NetFirewallRule -DisplayName "Allow Express SocketIO 3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow

```