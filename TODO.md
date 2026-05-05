# Workflows to create

- [x] User verification
- [x] TLS cert order process
- [x] Organisation claim
- [x] Organisation claim dispute
- [x] Organisation join
- [x] 2fa reset

- [x] SMIME cert order process
- [x] Adobe cert order process
- [X] aviation certificates

- [ ] certificate problem report
- [ ] configure workflow as super admin - user verification and 2fa examples

## Following cert orders will simply use the existing customer and admin portal UI as their 'prototype' design
- [ ] QES cert order process
- [ ] QSEAL order process
- [ ] QSCD issuance




-----

Now I want to add a workflow for qualified electronic signatures. As with the adobe order form there is no verification done during the workflow, it is all done beforehand. The first step should require the user to choose an owner, either themselves or one of the currently validated organisations they belong to. Then, if the owner is not themselves but an organisation they belong to, they should choose the user whose details will be used for the qualified electronic signature - this can be any currently validated user in their orgnisation. For the purposes of the prototype populate the select menu of users with some who aren't eligible because they are not yet validated, their validation has expired or they are currently suspended. If the owner is an organisation they user should have a boolean option to include details of the organisation, false by default. This should be a switch. The next stage will be to click 'continue'.  The next two steps are present on a conditional basis - if the owner of the certificate is an organisation the certificate order needs to be approved - resuse the UI and concepts from the tls flow for this. There should be a way to see what this looks like as the approver, as well as the requester, and the requesters viewpoint should have a slight delay (5 seconds) emulating the delay in waiting for their team mate to approve the order. The next step is 'natural person consent' and is required when the person who is ordering the certificate is not the person whose details are being used in the certificate. This is just another approval type step, so reuse the concepts of the approvaal step (emulated waiting for requester) and add a version of the prototype to show what it looks like from the perspective of the person giving their consent, covering both the case where they approve or deny the request to use their details. After these two conditional steps there should be a waiting step telling the user that their certificate is being provisioned and will be mailed to them. 