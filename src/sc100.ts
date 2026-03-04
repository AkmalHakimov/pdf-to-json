export const sampleSC100 = {
  id: 'e884587a-d1c7-4f55-9d3b-f25931a0c432',
  type: 'document',
  reference: '6a6e7485-d47c-4e08-91d1-e82eb2fd627c',
  children: [
    {
      id: 'e884587a-d1c7-4f55-9d3b-f25931a0c960',
      question: 'Plaintiff full name',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffName1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '6399bd41-e7d7-4c9a-8899-f0de0de6f3a4',
      question: 'Plaintiff phone',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffPhone1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: 'f0d20e52-6bdd-4602-8c1e-4f2dfcc11dba',
      question: 'Plaintiff residing street address',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffAddress1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '64bbe835-b1a2-401d-9674-e537af5baa51',
      question: 'Plaintiff residing city',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffCity1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '2c7b28b2-b0f0-4774-abfc-b8d63c470300',
      question: 'Plaintiff residing state',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffState1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: 'e435b5db-3f95-4eb1-9eec-f15ae3c7f173',
      question: 'Plaintiff residing zip',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffZip1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '5902d0d1-3965-49ee-9f1e-f15ae3c7f173',
      question: 'Is the plaintiff mailing address different from the residence?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '5446db45-728d-4eb0-bbae-1ed6b6cf8363',
          title: 'yes',
          value: [
            {
              id: '5902d0d1-3965-49ee-9f1e-b97d85e3d59e',
              question: 'Plaintiff mailing street address',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingAddress1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'd19ae0ad-c069-4fd4-90be-fe61476516bc',
              question: 'Plaintiff mailing city',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingCity1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'd5c0eb15-1195-49cd-99fb-452cb2c03d1f',
              question: 'Plaintiff mailing state',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingState1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '0f76b99a-dc6a-4f51-8b4c-1df9ee96e565',
              question: 'Plaintiff mailing zip',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingZip1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        { id: 'ee99d092-020b-4ae1-a954-172007b94852', title: 'no', value: [] }
      ]
    },
    {
      id: '9874fb6a-cfd1-4085-9bd6-c0a71ffee346',
      question: 'Plaintiff email if available',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].EmailAdd1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '2f803d99-a814-4969-96a4-15dc87defe2f',
      question: 'Is there a second plaintiff?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '92e1e467-1f9a-4b09-a538-0c5309455833',
          title: 'yes',
          value: [
            {
              id: '2f803d99-a814-4969-96a4-fa0d6d2c2ef5',
              question: 'Second plaintiff name',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffName2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '7e6633b8-43c2-4636-9349-15dc87defe2f',
              question: 'Second plaintiff phone',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffPhone2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'a48a1393-70c4-4ab7-8d2d-72f23ca61a0b',
              question: 'Second plaintiff residing street address',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffAddress2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '1a29c0ff-2cc2-42cc-8201-2bcc8fed6920',
              question: 'Second plaintiff residing city',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffCity2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '88162973-00aa-4ccf-a92c-088c71c35f92',
              question: 'Second plaintiff residing state',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffState2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'a0291321-87b4-494d-974c-80ff1e6a6ae5',
              question: 'Second plaintiff residing zip',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffZip2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '6a9d2603-4ef9-4702-989d-27fe9c63381b',
              question: 'Is the second plaintiff mailing address different from their residence?',
              confidence: 0,
              visited: false,
              type: 'mcq',
              value: 0,
              options: [
                {
                  id: '60c51c17-3d89-4ad7-8693-5c5b4d825700',
                  title: 'yes',
                  value: [
                    {
                      id: '6a9d2603-4ef9-4702-989d-ef29deb12b73',
                      question: 'Second plaintiff mailing street address',
                      confidence: 0,
                      visited: false,
                      mappings: [
                        {
                          mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingAddress2[0]',
                          value: '{{value}}'
                        }
                      ],
                      type: 'string',
                      value: '',
                      validation: {}
                    },
                    {
                      id: '29bc53ee-6533-48b5-a72a-27fe9c63381b',
                      question: 'Second plaintiff mailing city',
                      confidence: 0,
                      visited: false,
                      mappings: [
                        { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingCity2[0]', value: '{{value}}' }
                      ],
                      type: 'string',
                      value: '',
                      validation: {}
                    },
                    {
                      id: '417c4922-66a5-4371-9439-f9c4d905af5d',
                      question: 'Second plaintiff mailing state',
                      confidence: 0,
                      visited: false,
                      mappings: [
                        {
                          mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingState2[0]',
                          value: '{{value}}'
                        }
                      ],
                      type: 'string',
                      value: '',
                      validation: {}
                    },
                    {
                      id: '5b14b9b0-8faa-4277-8e10-a3ebe1eb9a93',
                      question: 'Second plaintiff mailing zip',
                      confidence: 0,
                      visited: false,
                      mappings: [
                        { mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingZip2[0]', value: '{{value}}' }
                      ],
                      type: 'string',
                      value: '',
                      validation: {}
                    }
                  ]
                },
                { id: '1e9b5f65-e95b-4d06-8c0c-0c12109ca1f9', title: 'no', value: [] }
              ]
            },
            {
              id: 'a6283e0f-6437-42a2-b4e3-c091b40d169d',
              question: 'Second plaintiff email if available',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].EmailAdd2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        { id: '82e48be7-8cd4-4946-8743-ebb2957993da', title: 'no', value: [] }
      ]
    },
    {
      id: '22e4de04-1c29-42c1-a4fa-8e647ea06e9a',
      question: 'Is any plaintiff doing business under a fictitious business name?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '1ad34a78-17c2-436d-883a-b12808bf2a3e',
          title: 'yes',
          value: [
            {
              id: 'a3cd43e4-beb7-444d-b624-86edd1aed262',
              mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].Checkbox2[0]', value: '2' }],
              type: 'inferred',
              hint: ''
            },
            {
              id: 'e5907243-7af6-472d-b09b-05d59916d795',
              type: 'document',
              reference: 'ce1b01aa-e80f-4c62-ab59-0b89c5313e76',
              children: [
                {
                  id: '9045a5e7-79f1-4402-a73e-757c4e3c7a7e',
                  mappings: [{ mapping: 'SC-103[0].Page1[0].Attachement[0].CheckBox1[0]', value: '1' }],
                  type: 'inferred',
                  hint: ''
                },
                {
                  id: 'aa81f590-cc7a-4cd3-ba87-042027a9a335',
                  question: 'Business name of the person suing',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText1[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: '4627d2de-c7a0-4e2d-aea8-771bbedbc7c4',
                  question: 'Business address (full address with street, city, state, zip)',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText2[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: '0b47d9b1-6809-4677-90e0-474d9ae867f8',
                  question: 'Does the business have a different mailing address?',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: 'de9f92c5-14a0-46d7-92b9-ace73d90a4a5',
                      title: 'yes',
                      value: [
                        {
                          id: '25f5f6ec-df6b-4c05-9745-01c65cb8ab77',
                          question: 'What is the mailing address (full address with street, city, state, zip)',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText3[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    },
                    { id: '728e7199-95e8-4205-8be5-ff59ec87048a', title: 'no', value: [] }
                  ]
                },
                {
                  id: '5613b26a-1031-4211-9aa4-1ee0a6344452',
                  question: 'What is the business classified as?',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: '7adad5a9-b301-4db6-8f87-d8bc27768ce2',
                      title: 'Individual',
                      value: [
                        {
                          id: 'a10587ac-9653-43b1-9ad7-279c71885c90',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: 'f67d1f4a-6eb3-47dd-bfdc-ddd7c3c157d3',
                      title: 'Corporation',
                      value: [
                        {
                          id: 'b648b261-0963-4a3f-bed5-9f1b800e49b7',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[1]', value: '2' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: '95930442-ae7f-4e8a-95fb-1e19b1a82df1',
                      title: 'Association',
                      value: [
                        {
                          id: 'a5002d22-8c8a-4a90-8ad0-f159c7d90f28',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[2]', value: '3' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: '51f8729c-2746-489f-94e1-e4d7b0e23542',
                      title: 'Limited Liability Company',
                      value: [
                        {
                          id: 'adee8fb3-7e5c-48c2-8676-4a43cd25c421',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[3]', value: '4' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: 'ea164ded-b2d9-4918-8817-bd095e80fb8a',
                      title: 'Partnership',
                      value: [
                        {
                          id: 'e53ada17-595d-4f97-bf76-51388128dbeb',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[4]', value: '5' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: '1f2b117a-6ba1-4932-ae78-673a151dd821',
                      title: 'Other',
                      value: [
                        {
                          id: 'f8992b94-5fac-4299-b547-6dfa55120990',
                          mappings: [{ mapping: 'SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[5]', value: '6' }],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: '22077ed6-cfd6-4ff1-9a66-fedee794896d',
                          question: 'Explain why you picked other',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-103[0].Page1[0].List2[0].item2[0].FillText4[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'f463fe2e-ce79-42e9-b326-e4f8abd12fea',
                  question: 'Name of the county where you filed your Fictitious Business Name Statement',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-103[0].Page1[0].List3[0].item3[0].FillText5[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: 'bcda8bca-89b6-400a-b86a-b24f221644eb',
                  question: 'Your Fictitious Business Name Statement number',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-103[0].Page1[0].List4[0].item4[0].FillText6[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: '14328d9f-8908-458c-996e-e4a1bef367fc',
                  question: 'Date your Fictitious Business Name Statement expires',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-103[0].Page1[0].List5[0].item5[0].FillText7[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                }
              ]
            }
          ]
        },
        { id: 'a415f6cf-41c0-4819-8f6e-1136e9e828c0', title: 'no', value: [] }
      ]
    },
    {
      id: '16aeb7d5-bd2c-4d62-aba3-dee34b765715',
      question:
        'Is any plaintiff a “licensee” or “deferred deposit originator” (payday lender) under Financial Code sections 23000 et seq',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List1[0].Item1[0].Checkbox3[0]', value: '3' }],
      type: 'boolean',
      value: false
    },
    {
      id: '2f2aa8b4-3e83-494e-921b-aa8f4a2de4a3',
      question: 'Defendant name',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantName1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '8c2ffbbb-21f8-4032-8ab5-523240871864',
      question: 'Defendant phone',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantPhone1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '13d3133e-5d0d-41c4-a308-7c2829f494ca',
      question: 'Defendant residing street address',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantAddress1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '0459f84b-c9f4-4208-8d78-3f927af2f0b7',
      question: 'Defendant residing city',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantCity1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '44080764-45b2-4ad0-989e-388a0fc51f3b',
      question: 'Defendant residing state',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantState1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: 'ea016222-e58b-43f4-9a12-42ed5f4d2d07',
      question: 'Defendant residing zip',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantZip1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '7453db39-ad39-4860-9e4a-ee14e4c2474a',
      question: 'Is the defendant mailing address different from their residing address?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: 'de0d6166-abe7-46b6-b36e-30404c3b486b',
          title: 'yes',
          value: [
            {
              id: 'dee2190a-d6f7-4bdb-8348-8787a8dc72e9',
              question: 'Defendant mailing street address',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantMailingAddress1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'ed77809b-33c5-43af-ac12-faffb11c5cec',
              question: 'Defendant mailing city',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantMailingCity1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '215a38bd-fc70-4de7-84d9-21f2f5b6a9a0',
              question: 'Defendant mailing state',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantMailingState1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '1c89c9a2-de76-4956-bf67-f2088d958e2f',
              question: 'Defendant mailing zip',
              confidence: 0,
              visited: false,
              mappings: [
                { mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantMailingZip1[0]', value: '{{value}}' }
              ],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        { id: '55a1502c-d410-4cfa-a871-c44888f9ad3e', title: 'no', value: [] }
      ]
    },
    {
      id: 'f11fd7d0-7df7-40e3-b0e6-e8ce29e894e3',
      question: 'Is the defendant a corporation, limited liability company, or public entity',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '8a474471-2f7f-45e5-bd8f-0bfb195c12a0',
          title: 'yes',
          value: [
            {
              id: '304dd1f7-1b41-489f-92be-814d00105767',
              question: 'Name of the person or agent authorized for service of process',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantName2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '0bf36bfa-089d-4411-8ad3-81c2cfe1e496',
              question: "Defendant's agent's job title if known",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantJob1[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '6b5faba7-3209-493a-a4a0-639bc9a4ed1f',
              question: "Defendant's agent's mailing street address",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantAddress2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '06d150f4-ecd3-473f-bdd4-94a08f15de15',
              question: "Defendant's agent's mailing city",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantCity2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: 'd6a5a1e3-e1f5-45d2-9567-57f153d6e203',
              question: "Defendant's agent's mailing state",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantState2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '05f4504a-974b-44a1-96ad-af3f98bd2855',
              question: "Defendant's agent's mailing zip",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].DefendantZip2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        { id: '228edcd0-0675-403b-8691-37a9685ddde9', title: 'no', value: [] }
      ]
    },
    {
      id: '0bb44703-d48d-4520-b46a-7f127f62e670',
      question: 'Is the defendant on active military duty',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '043eacc6-58c4-45fb-9aa3-4cb5d2e07d9e',
          title: 'yes',
          value: [
            {
              id: '0bb44703-d48d-4520-b46a-e67bb86e4f69',
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].Checkbox5[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            },
            {
              id: '524b8c80-ca9c-49ea-8a6a-7f127f62e670',
              question: "What is the active milatary defendant's name",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page2[0].List2[0].item2[0].FillField1[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        { id: 'bd562cb2-0d15-4187-9acd-859fcbf67e80', title: 'no', value: [] }
      ]
    },
    {
      id: '99c21753-6b85-4b8b-9b34-de78d931604e',
      question: 'How much money the defendant owes the plaintiff',
      confidence: 0,
      visited: false,
      mappings: [
        { mapping: 'SC-100[0].Page2[0].List3[0].PlaintiffClaimAmount1[0]', value: '{{value}}' },
        {
          mapping: 'SC-100[0].Page4[0].List10[0].Checkbox63[0]',
          value: '{{#if (isGreaterThan value 2500)}}1{{else}}Off{{/if}}'
        },
        {
          mapping: 'SC-100[0].Page4[0].List10[0].Checkbox63[1]',
          value: '{{#if (isLessThan value 2500)}}2{{else}}Off{{/if}}'
        }
      ],
      type: 'number',
      value: 0,
      validation: {}
    },
    {
      id: '39ed684b-6278-4108-8438-5a3106771684',
      question: 'Why does the defendant owe the plaintiff money',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page2[0].List3[0].Lia[0].FillField2[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: '5d24b8c2-465d-43e9-8a98-5e35b761629b',
      question: 'Do you know the exact date when the event happened?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: 'de9068bc-c679-4738-a5b9-47d17fd05c51',
          title: 'yes',
          value: [
            {
              id: '481aacdd-7ba4-480e-8d36-c4c1b8798af1',
              question: 'When did this event happen (date)',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page3[0].List3[0].Lib[0].Date1[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        },
        {
          id: 'e06caf1a-3644-4547-b4d1-6b3fb3b3c06a',
          title: 'no',
          value: [
            {
              id: '7a8fd492-2a7e-4669-a724-b6d7e930e486',
              question: 'When did this event start',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page3[0].List3[0].Lib[0].Date2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            },
            {
              id: '41c625f3-9291-4557-9da3-f00e0b17ca33',
              question: 'When did this event end',
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page3[0].List3[0].Lib[0].Date3[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        }
      ]
    },
    {
      id: 'd8481232-ec2f-4234-9706-97c8206b2e63',
      question: 'How was the money owed calculated',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page3[0].List3[0].Lic[0].FillField1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: 'f3873b4b-c726-4496-bc44-c03d856084ea',
      question: 'Have you asked the defendant to pay',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: 'bec4bb4a-5dad-4ad9-b427-b7458cb7811d',
          title: 'yes',
          value: [
            {
              id: 'f3873b4b-c726-4496-bc44-72d0b00712a0',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List4[0].Item4[0].Checkbox50[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            }
          ]
        },
        {
          id: '26c59e83-14d3-47b6-adb9-36dd8a322d9f',
          title: 'no',
          value: [
            {
              id: 'c0b38f18-bd2d-4bb7-8b31-c03d856084ea',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List4[0].Item4[0].Checkbox50[1]', value: '2' }],
              type: 'inferred',
              hint: ''
            },
            {
              id: 'f0f3ab09-1ca8-4d54-bf44-c9c941ac775d',
              question: "Why haven't you asked the defendant to pay",
              confidence: 0,
              visited: false,
              mappings: [{ mapping: 'SC-100[0].Page3[0].List4[0].Item4[0].FillField2[0]', value: '{{value}}' }],
              type: 'string',
              value: '',
              validation: {}
            }
          ]
        }
      ]
    },
    {
      id: '747a3f7e-169e-4157-9bcb-72eb3d8ff477',
      mappings: [{ mapping: 'SC-100[0].Page3[0].List5[0].Lia[0].Checkbox4[0]', value: '1' }],
      type: 'inferred',
      hint: ''
    },
    {
      id: '728e6a39-f8d4-41a8-a20e-867c68468726',
      question: 'Courthouse zipcode (if known)',
      confidence: 0,
      visited: false,
      mappings: [{ mapping: 'SC-100[0].Page3[0].List6[0].item6[0].ZipCode1[0]', value: '{{value}}' }],
      type: 'string',
      value: '',
      validation: {}
    },
    {
      id: 'dd0f2301-d1c6-4d00-b80b-d6fcef066c4c',
      question: 'Is this claim about an attorney-client fee dispute?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '312b05d0-8035-4d29-9e2a-f208f51b1552',
          title: 'yes',
          value: [
            {
              id: 'dd0f2301-d1c6-4d00-b80b-72701817dd39',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List7[0].item7[0].Checkbox60[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            },
            {
              id: '16cced3a-c29f-46df-8b56-292be01a2fee',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List7[0].item7[0].Checkbox11[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            },
            {
              id: 'a3cbb527-c61e-4ecc-a49c-65cb20df4e45',
              type: 'document',
              reference: 'd5a143fe-5e3b-4609-a298-b05cfb1873ae',
              children: [
                {
                  id: 'bc37fb2e-efbe-48a4-8ee8-097e8d373398',
                  question: 'How much money is in this dispute',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-101[0].Page1[0].List1[0].item1[0].Amount1[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: '771b7711-1f69-4d17-a729-4e1bf4c4ba50',
                  question: 'Are you the attorney or client',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: 'caae5161-31fc-438d-bcc0-5a6f2049d994',
                      title: 'attorney',
                      value: [
                        {
                          id: 'a8136598-b13b-4768-a9bb-1ad8b45c7ff9',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List2[0].item2[0].Ch1[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: '8909e549-f811-4af4-9c56-b86382d23179',
                      title: 'client',
                      value: [
                        {
                          id: 'ec3b81b4-bea2-4f82-a972-90df96dae893',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List2[0].item2[0].Ch1[1]', value: '2' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    }
                  ]
                },
                {
                  id: '4b22f1c7-38a6-4ae5-a8a8-acdc5d4fc5b1',
                  mappings: [{ mapping: 'SC-101[0].Page1[0].List3[0].Lia[0].Ch3[0]', value: '1' }],
                  type: 'inferred',
                  hint: ''
                },
                {
                  id: 'd8e394b5-987f-46f4-aeab-23becb18e85c',
                  question: 'Who did the arbitrator decide must pay?',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: 'b012c149-43a5-4fc8-a810-30cb98df7fbf',
                      title: 'client',
                      value: [
                        {
                          id: '1b81c5f5-e51f-470d-b5c1-a8455a71b9d4',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List3[0].Lia[0].ch2[1]', value: '2' }],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: 'b6e3ab4c-2c44-41f5-94b6-4d2045609d5c',
                          question: 'how much did the arbitrator decide must be paid',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List3[0].Lia[0].FillText3[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    },
                    {
                      id: '2e479227-269e-4a12-92e0-08524edab9cc',
                      title: 'attorney',
                      value: [
                        {
                          id: '19c0b2ed-8868-44f4-a0e3-8bd54254c3b4',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List3[0].Lia[0].ch2[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: 'b6e3ab4c-2c44-41f5-94b6-4d2045609d5c',
                          question: 'how much did the arbitrator decide must be paid',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List3[0].Lia[0].FillText3[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    },
                    {
                      id: '8e8594b9-f810-45b8-8c1a-cc57ec47f8e6',
                      title: 'neither party',
                      value: [
                        {
                          id: '8a2ae103-4952-45a3-93ee-ea6e82d18ccc',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List3[0].Lib[0].Ch3[0]', value: '2' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'ad0250d6-1764-436b-ad25-0ecc308dae36',
                  question: 'date of notice of award',
                  confidence: 0,
                  visited: false,
                  mappings: [{ mapping: 'SC-101[0].Page1[0].List4[0].item4[0].FillText4[0]', value: '{{value}}' }],
                  type: 'string',
                  value: '',
                  validation: {}
                },
                {
                  id: 'ac3b8a3f-5f10-45d5-85b1-f5749dc25212',
                  question: 'Why are you filing a small claim',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: 'a50381a5-db72-4f56-8e1b-812d5cb38a51',
                      title: 'I want to confirm the award',
                      value: [
                        {
                          id: 'ef022227-b167-4130-a07b-1655033788bb',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List5[0].Lia[0].CheckBox1[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: '885d066b-a3d8-48f8-bc53-2c2e810d29b3',
                      title: 'I want to correct the award',
                      value: [
                        {
                          id: '872399f5-9a52-4e08-a0d1-e353e4638f17',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].CheckBox2[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: 'b01f4631-d8c2-4d6a-8f51-d9aee8c7fdd0',
                          question: '',
                          confidence: 0,
                          visited: false,
                          type: 'mcq',
                          value: 0,
                          options: [
                            {
                              id: '6e0b7701-a916-4043-bfc2-30ef4bfc4479',
                              title: 'There was an error in calculation',
                              value: [
                                {
                                  id: '00f4c067-7c7c-4fb5-b41b-cfd2ecf41da5',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].Lii1[0].ch5[0]',
                                      value: '1'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '8ecf6c6c-427f-4b2d-afeb-37111dd1dd0f',
                              title: 'The arbitrator considered legal issues not allowed in this type of hearing',
                              value: [
                                {
                                  id: 'db8fb630-e503-4c6b-85a3-0753536c9c47',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].Lii2[0].ch5[0]',
                                      value: '2'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '4782cb1e-37b6-4abd-9340-914437fc998d',
                              title: "It doesn't follow the rules for proper wording, information or signature",
                              value: [
                                {
                                  id: '54a08321-8310-4736-8932-1ef5e4c92edf',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].Lii3[0].ch5[0]',
                                      value: '3'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: '9dcb32ee-29d9-40a3-87c8-f4fce21b5de5',
                          question: 'explain why',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].FillText4[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    },
                    {
                      id: '1bf06be4-ef67-4989-8e57-0cef6da3c34a',
                      title: 'I want the court to cancel the award',
                      value: [
                        {
                          id: '36c30806-eb5b-4814-b680-baf9a5a74bfb',
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].CheckBox3[0]', value: '{{value}}' }
                          ],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: '53c6171c-32f4-4a32-9678-6033f3b48c5c',
                          question: '',
                          confidence: 0,
                          visited: false,
                          type: 'mcq',
                          value: 0,
                          options: [
                            {
                              id: '7a5bff79-957c-4cac-bbc4-0353b0e6a48e',
                              title: 'The award was obtained by fraud',
                              value: [
                                {
                                  id: '2fa04ca2-9fd7-42bf-887a-6bf27a4c94a0',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii1[0].ch4[0]',
                                      value: '1'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '4eb864f6-a00f-489b-8862-27566b970e7f',
                              title: 'The arbitrator was corrupt',
                              value: [
                                {
                                  id: '45483632-128d-4dd0-a83f-190a9bbc5b08',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii2[0].ch4[0]',
                                      value: '2'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '1c67fe04-74f0-4960-9efe-6f6ec76afbcb',
                              title: 'The arbitrator did something wrong that substantially hurt my case',
                              value: [
                                {
                                  id: '2d91df67-938b-4a0c-8720-ae6074750e0d',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii3[0].ch4[0]',
                                      value: '3'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '85dee458-6092-429d-b40a-281a30bb6145',
                              title: 'The arbitrator considered legal issues not allowed in this type of hearing',
                              value: [
                                {
                                  id: '4a18f36f-a214-4784-88da-976746c8a256',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii4[0].ch4[0]',
                                      value: '4'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '47f040bb-004d-48d9-ac35-e15523297024',
                              title:
                                'The arbitrator refused to postpone my case or refused to consider important evidence that could help settle the dispute or conducted the hearing in an inappropriate manner',
                              value: [
                                {
                                  id: '9eed8f2a-0d1b-4d19-a6cb-6bbe7d742577',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii5[0].ch4[0]',
                                      value: '5'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            },
                            {
                              id: '032840cb-ac5d-4b59-8780-d4d0c4e83a36',
                              title:
                                'The arbitrator knew of reasons why they could have been disqualified from this case and failed to disclose them or did not disqualify themselves from the case after I asked them to do so',
                              value: [
                                {
                                  id: 'bef70dd1-cde1-481e-b3ef-5f618dd486d1',
                                  mappings: [
                                    {
                                      mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].SubLic[0].Lii6[0].ch4[0]',
                                      value: '6'
                                    }
                                  ],
                                  type: 'inferred',
                                  hint: ''
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: '4aeb7274-332f-4f65-92f4-7684e4ccb653',
                          question: 'explain',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].FillText7[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        },
                        {
                          id: 'a89b15fe-e77a-4b7f-8e74-193fcbbcc6ce',
                          question: 'are you asking for a new arbitrator hearing',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].CheckBox8[0]', value: '{{value}}' }
                          ],
                          type: 'boolean',
                          value: false
                        }
                      ]
                    },
                    {
                      id: 'cdff5025-60a9-4422-b5d2-b1c6a152573b',
                      title: 'I want a trial in small claims to decide the outcome',
                      value: [
                        {
                          id: 'b78bb847-f70a-4879-b10a-b44540294568',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List5[0].Lid[0].CheckBox9[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'd532b2e3-e2f4-4e89-a962-b514e9b1b7df',
                  question: 'Did you or your attorney attend the hearing?',
                  confidence: 0,
                  visited: false,
                  type: 'mcq',
                  value: 0,
                  options: [
                    {
                      id: '6488f937-a614-415c-8754-e8e6f4728b86',
                      title: 'yes',
                      value: [
                        {
                          id: 'fc6eacbe-5908-4415-a62f-4896c73869ef',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List6[0].item6[0].ch15[0]', value: '1' }],
                          type: 'inferred',
                          hint: ''
                        }
                      ]
                    },
                    {
                      id: 'a2df7fae-a531-4f1e-8653-f419e37eece6',
                      title: 'no',
                      value: [
                        {
                          id: '38a53684-adcf-4139-a9ad-bae37646995a',
                          mappings: [{ mapping: 'SC-101[0].Page1[0].List6[0].item6[0].ch15[1]', value: '2' }],
                          type: 'inferred',
                          hint: ''
                        },
                        {
                          id: 'ea5a6771-fba1-45f6-a54d-7001d9b2b33b',
                          question: 'Explain why you did not go',
                          confidence: 0,
                          visited: false,
                          mappings: [
                            { mapping: 'SC-101[0].Page1[0].List6[0].item6[0].FillText12[0]', value: '{{value}}' }
                          ],
                          type: 'string',
                          value: '',
                          validation: {}
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '5287fdc6-2400-40df-8dfa-32124892770f',
          title: 'no',
          value: [
            {
              id: '629c2fc3-e603-4fc2-99f2-d6fcef066c4c',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List7[0].item7[0].Checkbox60[1]', value: '2' }],
              type: 'inferred',
              hint: ''
            }
          ]
        }
      ]
    },
    {
      id: 'ad477402-a829-450d-bed8-ac82565b1d30',
      question: 'Are you suing a public entity',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '76fe1bd7-d09b-485a-b1a9-9a858f015a1e',
          title: 'yes',
          value: [
            {
              id: '3480fa73-4d0a-4927-b6d2-e6d3d4e63cf8',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List8[0].item8[0].Checkbox61[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            }
          ]
        },
        {
          id: '1f36fec7-5550-4aa2-838f-b758d2834217',
          title: 'no',
          value: [
            {
              id: 'f22b3269-1385-4bab-ac9d-d3b6e30334d8',
              mappings: [{ mapping: 'SC-100[0].Page3[0].List8[0].item8[0].Checkbox61[1]', value: '2' }],
              type: 'inferred',
              hint: ''
            }
          ]
        }
      ]
    },
    {
      id: '7fdd256d-450c-4ca1-ac30-52fe58e45a61',
      question: 'Has the plaintiff filed more than 12 small claims this year?',
      confidence: 0,
      visited: false,
      type: 'mcq',
      value: 0,
      options: [
        {
          id: '6008db83-494b-40e1-9bc0-ddb93bc5a558',
          title: 'yes',
          value: [
            {
              id: '7fdd256d-450c-4ca1-ac30-fc90ef06740e',
              mappings: [{ mapping: 'SC-100[0].Page4[0].List9[0].Item9[0].Checkbox62[0]', value: '1' }],
              type: 'inferred',
              hint: ''
            }
          ]
        },
        {
          id: 'eae84b65-a0ce-4f72-8f28-b5cf4c117b55',
          title: 'no',
          value: [
            {
              id: '2e830263-7e7d-4940-8df1-52fe58e45a61',
              mappings: [{ mapping: 'SC-100[0].Page4[0].List9[0].Item9[0].Checkbox62[1]', value: '2' }],
              type: 'inferred',
              hint: ''
            }
          ]
        }
      ]
    }
  ]
}
