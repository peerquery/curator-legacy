module.exports = function(account) {
    
    const totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares) - parseFloat(account.vesting_withdraw_rate);
    const elapsed = Math.floor(Date.now() / 1000) - account.voting_manabar.last_update_time;
    const maxMana = totalShares * 1000000;
    // 432000 sec = 5 days
    let currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;
    if (currentMana > maxMana) currentMana = maxMana;
    const currentManaPerc = currentMana * 100 / maxMana;
    return currentManaPerc;

};