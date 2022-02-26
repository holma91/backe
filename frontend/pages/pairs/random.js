function get_sls_personalized_onboard_schedule(folderId, fileName, fileId) {
    var destFolder = DriveApp.getFolderById(folderId);
    var sls_personalized_onboard_schedule = DriveApp.getFileById(fileId).makeCopy(fileName, destFolder);
    return sls_personalized_onboard_schedule;
}

function myFunction() {
    var ss1 = SpreadsheetApp.openById('159KavbdRNevUMS9dVc94dgcAh040dKz1xNir1FmbV0s'); // connects the script to the AQO Onboarding information ss
    var aqo_onboarding_info = ss1.getSheetByName('Sheet1'); // choses Sheet1
    var totalRows = aqo_onboarding_info.getLastRow() - 1; //fetches all rows with data
    var statusColPostLDAP = aqo_onboarding_info.getRange(2, 15, totalRows, 1).getValues(); // takes all the values in Column J and puts it into an array

    for (var i = 0; i < statusColPostLDAP.length; i++) {
        if (statusColPostLDAP[i] == 'Onboarding Initiated' || statusColPostLDAP[i] == null) {
            continue;
        } else {
            var new_SLS = aqo_onboarding_info.getRange(i + 2, 6).getValue(); //get onboardee name
            var new_SLS_LDAP = aqo_onboarding_info.getRange(i + 2, 9).getValue(); //onboardee ldap
            var onboardingStartDate = aqo_onboarding_info.getRange(i + 2, 13).getValue();
            var postLDAPStatus = aqo_onboarding_info.getRange(i + 2, 15).getValue(); //get status
            var ss_file_name = new_SLS_LDAP + '_onboarding_scheule'; //create name for ss
        }

        if (postLDAPStatus == 'Initiate post-LDAP Onboarding') {
            var setColor = aqo_onboarding_info
                .getRange(i + 2, 15)
                .setValue('Onboarding Initiated')
                .setBackground('Green');

            var sls_personalized_onboard_schedule = get_sls_personalized_onboard_schedule(
                '13g1vAQm-kVhIgvzBE8ve35YTBwwTpjNF',
                '1xOXY6Z1hMpt5MI3Ym1761KVXB3Ima-TgNVv45AJmyGw',
                ss_file_name
            );
            // connect to the now copy of the spreadsheet we made above
        }
    }
}

function myFunction2() {
    var ss_file_name = new_SLS_LDAP + '_onboarding_scheule'; //create name for ss
    var sls_personalized_onboard_schedule = get_sls_personalized_onboard_schedule(
        '13g1vAQm-kVhIgvzBE8ve35YTBwwTpjNF',
        '1xOXY6Z1hMpt5MI3Ym1761KVXB3Ima-TgNVv45AJmyGw',
        ss_file_name
    );

    var ss2 = SpreadsheetApp.open(sls_personalized_onboard_schedule);
    var sls_personalized_onboard_tracker = ss2.getSheetByName('test');
    var setValue = sls_personalized_onboard_tracker.getRange('A2').setValue(onboardingStartDate);
    var totalRows2 = sls_personalized_onboard_tracker.getLastRow() - 1; //fetches all rows with data
    var sendInviteCol = sls_personalized_onboard_tracker.getRange(2, 10, totalRows2, 1).getValues(); // takes all the values in Column J and puts it into an array

    // loop thru the new copy of the spreadsheet we made previously

    for (var y = 0; y < sendInviteCol.length; y++) {
        if (sendInviteCol[y] == 'DO NOT SEND INVITE' || sendInviteCol[y] == null) {
            continue;
        } else {
            var day = sls_personalized_onboard_tracker.getRange(y + 2, 2).getValue();
            var expectedTimeEffort = sls_personalized_onboard_tracker.getRange(y + 2, 4).getValue();
            var inviteColStatus = sls_personalized_onboard_tracker.getRange(y + 2, 10).getValue();
            var email_subject = 'hello, welcome to onboarding' + day;
            var email_body = 'documents etc....';
        }

        if (inviteColStatus == 'SEND INVITE') {
            var sendEmail = MailApp.sendEmail(new_SLS_LDAP, email_subject, email_body);
            var setStatusValue = sls_personalized_onboard_tracker
                .getRange(y + 2, 11)
                .setValue('Email Sent')
                .setBackground('Green');
        }
    }
}
