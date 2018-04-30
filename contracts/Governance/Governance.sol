pragma solidity ^0.4.22;

import "./Voting.sol";

contract Governance{

    address public tokenAddress;
    address public creator;
    Voting votingContract;

    mapping (address => bool) public badgeHolder;
    uint membersCount;

    uint public quorumCount;
    uint public voteDuration;

    mapping(uint => proposalInfo) public proposalMap;


    modifier isBadgeHolder(){
        require(badgeHolder[msg.sender] || msg.sender == creator);
        _;
    }

    struct proposalInfo{
        bytes32 ProposalType;
        address Proposer;
        address addressValue;
        bytes32 bytesValue;
        uint numValue;
    }
    event VoteAddr(address votingAddr);
    constructor (address _tokenAddress, uint _quorumCount, uint _voteDuration) public {
        quorumCount = _quorumCount;
        voteDuration = _voteDuration;
        tokenAddress = _tokenAddress;
        votingContract = new Voting(_tokenAddress);
        creator = msg.sender;
        emit VoteAddr(address(votingContract));
    }

    function addBadgeHolder(address _member) internal {
        badgeHolder[_member] = true;
    }

    function removeBadgeHolder(address _member) internal {
        badgeHolder[_member] = false;
    }


    function processProposal(uint _proposalID) public {
        require(votingContract.reveal(_proposalID));
        if (proposalMap[_proposalID].ProposalType == "addMember"){
            addBadgeHolder(proposalMap[_proposalID].addressValue);
        }

    }

    event ProposalStarted (bytes32 ProposalType, address creator, uint pollId);

    function proposeAddMember(address _member) isBadgeHolder {
        require(!badgeHolder[_member]);
        uint pollId = votingContract.startPoll(quorumCount,voteDuration);

        proposalMap[pollId] = proposalInfo({ProposalType:"addMember",
        Proposer:msg.sender,
        addressValue:_member,
        bytesValue:"",
        numValue:0}
        );

        //emit event
        emit ProposalStarted("addMember",msg.sender, pollId);
    }
    //propose to change wallet
    //propose to change dividends

    //propose to add member
    //propose to remove member

    //voting period length
} 
