// external dependencies
import * as uuid from 'uuid/v1';
// local dependencies
import * as projects from './projects';
import * as Objects from './db-types';
import loggerSetup from '../utils/logger';

const log = loggerSetup();



// -----------------------------------------------------------------------------
//
// PROJECTS
//
// -----------------------------------------------------------------------------

export function createProject(
    userid: string, classid: string, type: string, name: string,
): Objects.ProjectDbRow
{
    log.debug({ userid, type, name }, 'Creating a project object');

    if (projects.typeLabels.indexOf(type) === -1) {
        throw new Error('Invalid project type ' + type);
    }

    if (userid === undefined || userid === '' ||
        name === undefined || name === '' ||
        classid === undefined || classid === '')
    {
        throw new Error('Missing required attributes');
    }

    return {
        id : uuid(),
        userid,
        classid,
        typeid : projects.typesByLabel[type].id,
        name,
        labels : '',
    };
}

export function getProjectFromDbRow(row: Objects.ProjectDbRow): Objects.Project {
    return {
        id : row.id,
        userid : row.userid,
        classid : row.classid,
        type : projects.typesById[row.typeid].label,
        name : row.name,
        labels : getLabelsFromList(row.labels),
    };
}

export function getLabelsFromList(liststr: string): string[] {
    return liststr.split(',')
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0);
}

// -----------------------------------------------------------------------------
//
// TRAINING DATA
//
// -----------------------------------------------------------------------------

export function createTextTraining(projectid: string, data: string, label: string): Objects.TextTraining {
    if (projectid === undefined || projectid === '' ||
        data === undefined || data === '')
    {
        throw new Error('Missing required attributes');
    }

    const object: any = {
        id : uuid(),
        projectid,
        textdata : data,
    };

    if (label) {
        object.label = label;
    }

    return object;
}


export function getTextTrainingFromDbRow(row: Objects.TextTrainingDbRow): Objects.TextTraining {
    const obj: any = {
        id : row.id,
        textdata : row.textdata,
    };
    if (row.label) {
        obj.label = row.label;
    }
    if (row.projectid) {
        obj.projectid = row.projectid;
    }
    return obj;
}

