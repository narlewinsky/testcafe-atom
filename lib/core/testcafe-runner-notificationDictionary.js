'use babel';


export const testCafeRunnerNotificationDictionary = {
    error(number, detailMessage = ``) {
        switch(number) {
            case 400:
                atom.notifications
                    .addError(`The selected test declaration line is wrong or unavailable. ${detailMessage}`);
                break;
        }
    },

    success(number, detailMessage = ``) {
        switch(number) {
            case 400:
                // atom.notifications
                //     .addSucces(`Prepare: ${detailMessage}`);
                // break;
        }
    },
}
