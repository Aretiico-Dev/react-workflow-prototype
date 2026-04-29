Organisation claim process

# Claimant's view

Step 1 - 

search input for user to search for their organisation. Behind the scenes this will search all the legal entities we have compiled from the UK legal entity registers we can access - companies house, mutuals spreadsheet, fca bank register etc. 
User selects one and clicks 'next'

Text stating something like 'You, John Smith, are applying to become the official representative of ABC co'

Step 2 - user fills in form asking for their role at the organisation (free text), organisation website, telephone number, email and name of one person with significant control we can speak to and what their role is (free text field) - note that we prefer to speak to someone other than the applicant if at all possible, but that we understand the applicant may be the same person - in that case allow the user to check a checkbox with a label like 'I am a person with significant control' and disable the fields for providing another person's details. 

User submits to continue

Step 3 - user checks checkbox to accept terms and conditions. Terms are an embedded pdf that can also be downloaded using a link. 
User submits to complete claim 

Step 4 - thank you for your application, it is being reviewed and you will be notified as soon as we have made a decision.

Step 5 - success or rejection page determined by the admin approvers decision.

# Application reviewers view

Step 1 - New claim for review

Between the claimant submitting their claim and the reviewer seeing this view several automated jobs will have run to check if the organisation can be validated - sanctions checks, embargoed countries, automated background check report, identification of persons with significant control and sacntions checks on each of these people. 

The reviewer will only be asked to review the claim if all these automated checks were considered successful and the outcome was not negative. However, i want the reviewer to see a list of all the completed checks and be able to view the results by clicking to download a pdf or expand an expansion panel to see the json returned by the apis etc. 

At the foot of the page wil be a continue button. 

Step 2 - Manual check

The reviewer is required to create an informal internet research report about the company and upload it as a pdf.

Reviewer clicks next to continue.

Step 3 - Reviewer is shown the contact details that were provided by the applicant for the person with significant control in a form with inputs. Reviewer is required to check these online to see if this information is credible. If the user thinks they are credible then they can save them - after saving the fields become readonly and are marked as 'checked' in some way. if the user decides they do not reflect the real contact details then they can change them in the form and 'save'. The result will be a set of readonly inputs showing the details we decided to use. Allow the reviwer to 'unlock' the form after saving them so that if they accidentally save them and then change their mind they can go back. The idea is to create a set of contact details we can refer back to later and show what was used to contact the organisation.

Once reviewer has 'saved' the details they click 'continue' to go to the next step

Step 4 - contact the person with significant control on the phone

The reviewer calls the company and asks them to confirm verbally that they are aware of the application and accept the applicant as their representative. They are asked to provide an email so that we can do a teams call. 

This step should have call instructions (including the name and number of the person to call), a checkbox to confirm the organisation accepts, an email input to capture the email address to use for a teams call, a date time input to determine the date and time of the teams call, a text area to record any comments and a 'continue' button to go to the next step. It should also have a button to allow the reviewer to cancel the process on the basis that the person they spoke to rejected the applicant as a representative. 

Step 5 - This should anticipate the teams call, with a button to 'join the call' and a script to sue during the call. Emulate the exsiting step we have for user verification. Once the call is joined the step remains except that a button to 'continue' should appear, allowing the user to continue to the next step after they have completed the call.

Step 6 - this could allow the user to upload a video file of the teams call, and provide a text area for any comments. Emulate the step we have for this in the user verification flow. 

Step 7 - This step should provide the user with a file upload - they are waiting for an email from the organisation documenting their acceptance of the applicant to represent them. this pdf will be digitally signed using an organisation affiliated email address. Once the reviewer uploads this pdf they should be able to click 'continue'.

Step 8 - summary of application and send for review
This step should list all the evidence collected so far so that the reviewer can have a final check before they send for the admin approver to approve or reject. 
Like the user verification process this step and the previous steps shoudl allow the user to add a 'flag' for any comments they want to raise for the admin approver to read before approving. 
The button on this page shoudl say 'send for review'

Step 9 - conclusion page - should say 'application sent for review'

# Admin approvers view

Just one step, the same as step 8 for the reviewer with a list of all evidence, but with a reject or accept button at the footer. Use the example in our user verification flow as a reference. 

Maybe a final step saying something like 'you rejected this application for john smith' etc