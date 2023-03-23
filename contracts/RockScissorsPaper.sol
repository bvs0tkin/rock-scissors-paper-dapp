// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract RockScissorsPaper {
    constructor() payable {}

    //1 BNB = 10^18 wei
    //1 BNB = 10^9 gwei
    //0.0001 BNB = 100000 gwei

    event GamePlayed(address player, bool result);

    // 0 - Rock
    // 1 - Scissors
    // 2 - Paper
    function playWithSC(uint8 _option) public payable returns (bool) {
        require(
            _option <= 2,
            "You can choose only 0 (Rock), 1 (Scissors), 2 (Paper)"
        );
        require(
            msg.value >= 100000 gwei,
            "Game: Wrong bid amount. Minimal: 0.0001 BNB (100 000 gwei)"
        );
        require(
            msg.value <= address(this).balance * 2,
            "Smart-contract run out of funds"
        );
        uint256 _smResult = block.timestamp % 3;

        if (
            (_option == 0 && _smResult == 1) ||
            (_option == 1 && _smResult == 2) ||
            (_option == 2 && _smResult == 0)
        ) {
            payable(msg.sender).transfer(msg.value * 2);
            emit GamePlayed(msg.sender, true);
            return true;
        } else {
            emit GamePlayed(msg.sender, false);
            return false;
        }
    }
}
