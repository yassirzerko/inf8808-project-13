import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavBar } from '../components/NavBar';

function Home() {
  const CardSs = () => {
    return (<Card sx={{ width: 500, border: 1, height: 'auto'}} elevation={12}>
      <CardMedia
        component="img"
        height="200"
        image={require("./viz1.png")}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          Visualisation titre
        </Typography>
        <Typography variant="body2" color="text.secondary">
          La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
          Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
          Catégorie d’application
          Évaluation de contenu
          Version minimale d’Android requise
          Genres
          Type (application payante ou application gratuite)

        </Typography>
      </CardContent>
      <CardActions>
        <Button size="medium" component={Link} to={'/categorical'}>Voir la visualisation</Button>
      </CardActions>
    </Card>)
  }
  let cards = []
  for (let i = 0; i < 3; i++) {
    cards.push(<Box><CardSs></CardSs></Box>)
  }
  return (
    <Box backgroundColor={'#d3d3d3'} height={'100vh'}>
      <NavBar></NavBar>
        <Typography variant="h1" color="text.primary" pl={'40%'}>
          A propos
        </Typography>
        <Typography variant="body2" color="text.secondary" pl = {'10%'} pr ={'10%'} pt ={2}>
          La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
          Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
          Catégorie d’application
          Évaluation de contenu
          Version minimale d’Android requise
          Genres
          Type (application payante ou application gratuite)
          La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
          Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
          Catégorie d’application
          Évaluation de contenu
          Version minimale d’Android requise
          Genres
          Type (application payante ou application gratuite)
        </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }} pt={5}>
        <Card sx={{ width: 500, border: 1, height: 'auto'}} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz1.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              Visualisation titre
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
              Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
              Catégorie d’application
              Évaluation de contenu
              Version minimale d’Android requise
              Genres
              Type (application payante ou application gratuite)

            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={'/categorical'}>Voir la visualisation</Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 500, border: 1, height: 'auto'}} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz2.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              Visualisation titre
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
              Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
              Catégorie d’application
              Évaluation de contenu
              Version minimale d’Android requise
              Genres
              Type (application payante ou application gratuite)

            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={'/categorical'}>Voir la visualisation</Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 500, border: 1, height: 'auto'}} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz3.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div">
              Visualisation titre
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements.
              Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois)  :
              Catégorie d’application
              Évaluation de contenu
              Version minimale d’Android requise
              Genres
              Type (application payante ou application gratuite)

            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={'/categorical'}>Voir la visualisation</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
