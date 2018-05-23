// local dependencies
import * as Types from '../db/db-types';
import * as TrainingTypes from '../training/training-types';
import * as conversation from '../training/conversation';
import * as visualrecog from '../training/visualrecognition';
import * as ScratchTypes from './scratchx-types';




export function getStatus(scratchKey: Types.ScratchKey): Promise<ScratchTypes.Status> {
    if (!scratchKey.classifierid) {
        return Promise.resolve({
            status : scratchKey.type === 'numbers' ? 2 : 0,
            msg : 'No models trained yet - only random answers can be chosen',
        });
    }

    switch (scratchKey.type) {
    case 'text':
        return getTextClassifierStatus(scratchKey);
    case 'images':
        return getImageClassifierStatus(scratchKey);
    case 'numbers':
        return getNumbersClassifierStatus(scratchKey);
    }
}




async function getTextClassifierStatus(scratchKey: Types.ScratchKey): Promise<ScratchTypes.Status> {

    if (scratchKey.credentials && scratchKey.classifierid) {
        const credentials: TrainingTypes.BluemixCredentials = scratchKey.credentials;
        const classifier: TrainingTypes.ConversationWorkspace = {
            id : 'workspaceid',
            name: scratchKey.name,
            workspace_id: scratchKey.classifierid,
            credentialsid: credentials.id,
            created: new Date(),
            expiry: new Date(),
            language: 'en',
            url: scratchKey.credentials.url + '/v1/workspaces/' + scratchKey.classifierid,
        };

        const classifierWithStatus = await conversation.getStatus(credentials, classifier);
        if (classifierWithStatus.status === 'Available') {
            return {
                status : 2,
                msg : 'Ready',
            };
        }
        else if (classifierWithStatus.status === 'Training') {
            return {
                status : 1,
                msg : 'Model not ready yet',
            };
        }

        return {
            status : 0,
            msg : 'Model ' + classifierWithStatus.status,
        };
    }

    return {
        status : 0,
        msg : 'Classifier not found',
    };
}



async function getImageClassifierStatus(scratchKey: Types.ScratchKey): Promise<ScratchTypes.Status> {

    if (scratchKey.credentials && scratchKey.classifierid) {
        const credentials: TrainingTypes.BluemixCredentials = scratchKey.credentials;
        const classifier: TrainingTypes.VisualClassifier = {
            id : 'classifierid',
            name : scratchKey.name,
            classifierid : scratchKey.classifierid,
            credentialsid : credentials.id,
            created: new Date(),
            expiry: new Date(),
            url: scratchKey.credentials.url + '/v3/classifiers/' + scratchKey.classifierid,
        };

        const classifierWithStatus = await visualrecog.getStatus(credentials, classifier);
        if (classifierWithStatus.status === 'ready') {
            return {
                status : 2,
                msg : 'Ready',
            };
        }
        else if (classifierWithStatus.status === 'training') {
            return {
                status : 1,
                msg : 'Model not ready yet',
            };
        }

        return {
            status : 0,
            msg : 'Model ' + classifierWithStatus.status,
        };
    }

    return {
        status : 0,
        msg : 'Classifier not found',
    };
}



function getNumbersClassifierStatus(scratchKey: Types.ScratchKey): Promise<ScratchTypes.Status> {
    return Promise.resolve({ status : 2, msg : 'Status for ' + scratchKey.name });
}
