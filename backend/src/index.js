const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const members = [];

function logRequest(request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
    return next();
}

function validateMemberId(request, response, next) {
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ error: 'Invalid member ID' });
    }

    return next();
}

app.use(logRequest);
app.use('/members/:id', validateMemberId);

app.get('/members', (request, response) => {
    return response.json(members);
});

app.post('/members', (request, response) => {

    const { name, age, gender } = request.body;

    const member = {
        id: uuid(),
        name,
        age,
        gender,
    }

    members.push(member);
    return response.json(member);

});

app.put('/members/:id', (request, response) => {
    const { id } = request.params;
    const { name, age, gender } = request.body;

    const memberIndex = members.findIndex(member => member.id === id);

    if(memberIndex < 0){
        return response.status(400).json({ error: 'Project not found' });
    }

    const member = {
        id,
        name,
        age,
        gender
    };

    members[memberIndex] = member;

    console.log(member);

    return response.json(member);
});

app.delete('/members/:id', (request, response) => {
    const { id } = request.params;
    
    const memberIndex = members.findIndex(member => member.id === id);

    if(memberIndex < 0){
        return response.status(400).json({ error: 'Project not found' });
    }

    members.splice(memberIndex, 1)
    
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('🚀 Backend started on port 3333');
});