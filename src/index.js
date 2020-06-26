const express = require('express');
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [
  {
    id: '1',
    title: 'Projeto inovador de aplicativo',
    owner: 'Dinirso Junior' 
  },
  {
    id: '2',
    title: 'Projeto de site com NodeJS e React',
    owner: 'Carla Lemes'
  }
];

//MIDDLEWARES
function logRequests(req, res, next) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}]: ${url}`;
  
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validadateId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error : 'invalid project ID.' });
  }

  return next();
}

//CHAMAR MIDDLEWARES
//para usar em um ex: app.get('/rota', middleware1, middleware2, (req, res) => {...});
//para usar apenas em algumas rotas: app.use('/projects/:id', middleware);
app.use('/projects/:id', validadateId);

//chamando middleware para todos os métodos
app.use(logRequests);

app.get('/', (req, res) => {
  return res.send('hello bola');
})

app.get('/projects', (req, res) => {
  const { title } = req.query;

  const results = title ? projects.filter(project => project.title.includes(title)) : projects;

  return res.json(results);
});

app.post('/projects', (req, res) => {
  const { title, owner } = req.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return res.json(project);
});

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;
  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return res.status(400).json({ error: 'project not found' });
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return res.status(400).json({ error: 'project not found' });
  }

  projects.splice(projectIndex, 1);

  return res.send();
});

app.listen(3333, () => {
  console.log('🚀 servidor ouvindo na 3333');
});