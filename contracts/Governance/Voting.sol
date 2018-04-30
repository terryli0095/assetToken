pragma solidity ^0.4.22;

import "./ERC20.sol";
import "./governance.sol";
import "./Ownable.sol";

contract Voting is Ownable{

    /// maps pollID to Poll struct
    mapping(uint => Poll) public pollMap;
    uint pollNonce;

    uint constant INITIAL_POLL_NONCE = 0;
    ERC20 public token;
    Governance public governance;

    struct Poll {
        uint endDate;           /// expiration date of commit period for poll
        uint voteQuorum;	    /// number of votes required for a proposal to pass
        mapping (address => bool) votesFor;
        address[] voters;
    }


    event PollCreated(uint voteQuorum,uint  endDate, uint pollNonce);

    modifier isBadgeHolder(){
        require(governance.badgeHolder(msg.sender));
        _;
    }

    constructor(address _tokenAddr){
        token = ERC20(_tokenAddr);
        governance = Governance(msg.sender);
        pollNonce = INITIAL_POLL_NONCE;

    }

    function startPoll(uint _voteQuorum, uint _duration) public returns (uint pollID) {
        pollNonce = pollNonce + 1;
        address[] memory list;
        pollMap[pollNonce] = Poll({
            voteQuorum: _voteQuorum,
            endDate: block.timestamp + _duration,
            voters: list
        });

        PollCreated(_voteQuorum, block.timestamp+ _duration, pollNonce);
        return pollNonce;
    }
    event VoteRegistered(uint pollId,address voter, bool vote);

    //isBadgeHolder

    function vote( uint _pollId, bool _vote)  public {
        // require( now < pollMap[_pollId].endDate);
        if (_vote){
            pollMap[_pollId].votesFor[msg.sender] = true;
            pollMap[_pollId].voters.push(msg.sender);
        } else{
            pollMap[_pollId].votesFor[msg.sender] = false;
        }
        VoteRegistered(_pollId,msg.sender,_vote);
    }


    function reveal(uint _pollId) onlyOwner returns (bool result){
        // require( now > pollMap[pollNonce].endDate);
        uint totalForVotes;
        address[] voters = pollMap[_pollId].voters;
        for (uint i =0; i <voters.length; i++){
            if(pollMap[_pollId].votesFor[voters[i]]== true){
                totalForVotes+= 1; //token.balanceOf(voters[i]);
            }
        }
        if (totalForVotes> pollMap[_pollId].voteQuorum){
            return true;
        }else{
            return false;
        }


    }


}
