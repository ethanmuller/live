const partyList = []

function makeId(length) {
  const result           = [];
  const consonants       = 'BCDFGHJLMPRSTVYZ';
  const vowels       = 'AEIOU';
  const charLists = [consonants, vowels]

  for ( let i = 0; i < length; i++ ) {
    let list

    if (i === 0 || i === length - 1) {
      list = consonants
    } else {
      list = vowels
    }

    let charactersLength = list.length;
    result.push(list.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

function addParty(newPartyData) {
  const party = {
    ticket: newPartyData.ticket,
    selectedGame: newPartyData.selectedGame,
    id: makeId(4).toLowerCase(),
    memberCount: 0,
  }

  partyList.push(party)

  return party
}

function getParty(id) {
  return partyList.find((p) => id === p.id)
}

function endParty(id) {
  const party = partyList.find((p) => id === p.id)
  const partyIndex = partyList.indexOf(party)
  console.log('ending party', party)

  partyList.splice(partyIndex, 1)
  // if (!party) {
  //   return false
  // }


  // party.isEnded = true

  // partyList = partyList.filter((p) => id !== p.id)

  return true
}

module.exports = {
  partyList,
  addParty,
  getParty,
  endParty,
}
