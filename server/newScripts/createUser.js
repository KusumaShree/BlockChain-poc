/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const _ = require('lodash')
const protos = require('../blockchain/protos')
const request = require('request-promise-native')
const {
  awaitServerPubkey,
  getTxnCreator,
  submitTxns,
  encodeTimestampedPayload
} = require('../system/submit_utils')

const SERVER = process.env.SERVER || 'http://localhost:3000'

// const DATA = process.env.DATA
// if (DATA.indexOf('.json') === -1) {
//   throw new Error('Use the "DATA" environment variable to specify a JSON file')
// }

let agents = null

const create = jsonData => {
  agents = jsonData
  console.log(JSON.stringify(agents))
  protos.compile()
  .then(awaitServerPubkey)
  .then(batcherPublicKey => getTxnCreator(null, batcherPublicKey))
  .then(() => {
        const userRequests = agents.map(agent => {
        const user = _.omit(agent, 'name', 'privateKey', 'hashedPassword')
        console.log(JSON.stringify(user))
        user.password = agent.hashedPassword
        return request({
            method: 'POST',
            url: `${SERVER}/users`,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        })

        return Promise.all(userRequests)
  })
  .then(res => console.log('User creation submitted:\n', JSON.parse(res)))
  .catch(err => {
    console.error(err.toString())
    process.exit()
  })
}
  module.exports = {
    create
  }