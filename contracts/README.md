- To handle multiple NFTs and ensure that the fee distribution works correctly for each NFT, we are keeping track of fraction holders and their respective holdings for each NFT separately. 

- distributeFractions function: This function is added to the FractionalizeSNFT contract. It takes the fraction contract address, an array of recipients, and an array of percentages. It checks that the total percentages sum up to 100 and distributes the tokens accordingly.

- SFTFrenToken contract: The SFTFrenToken contract is updated to handle the transfer logic, including the
 royalty fee deduction.

These contract functions will ensure that the fractionalized tokens can be distributed according to user-specified percentages among multiple recipients.

