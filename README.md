<p align="center"><a href="#" target="_blank" rel="noopener noreferrer"><img width="500" src="images/RTHB-icon.png"></a></p>

# Thai Baht Coin, Backed by BTC
We developed this project for proof of concept of secured issued Thai Baht Stable Coin called RTHB, That all RTHBS're backed by BTC.

## Introduction
We intend to prove that if we believe Bitcoin is new Gold standard, And almost every Fiat money're backed by Gold, so why not we do the same thing on Blockchain space, just issue Stable Coin that backed by Bitcoin.

## Hot it works
In bitcoin ecosystem we have [RSK project (rootstock)](https://www.rsk.co/) that allowed us to build Smart Conntracts that can interact with RBTC (~BTC) and put some business logics on them.

We create RTHB, which's ERC20-Compatible token, and features following below.
1. Anyone can send RBTC to function **issue()**, and get back brannd new RTHB, the amount of RTHB calculated by 1.5:1 (adjustable).
2. RTHB holders can freely transfer any amount of RTHB to anyonne.
3. The owner of contract in (1) can get back their RBTC by return full amount of RTHB in that contract (calling **claim()**).
4. When RBTC price drop and conntracts that have RBTC backed below 130%, these contracts're forced sale and anyone can call to **publicTakeover()** without contract ownership.

## Example of issuinng RTHB
### Scenario 1 - Pirce is stable

### Scenario 2 - Pirce is incrase

### Scenario 3 - Pirce is decrease

## To-do
- Implemet some missing ERC20 functions.
