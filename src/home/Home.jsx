import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { NavBar } from "../components/NavBar";

const texts = {
  title: "INF8808 - Projet equipe 13",
  introduction:
    "  Le “Google play store” est la plateforme officielle de distribution d'applications pour les cellulaires intelligents fonctionnant sous le système d'exploitation Android. Bien qu'utilisée principalement pour acquérir des applications, la plateforme développée par Google permet également l’acquisition de musique, de livres, de films… En 2021, le “Google play store” a compté plus de 110 milliards téléchargements d’applications et plus de 2,5 millions d’applications disponibles. De plus, Android est actuellement le système d’exploitation de références pour cellulaires intelligents, avec 84 % des parts de marché mondiales. C’est une plateforme populaire et à succès, il est alors naturel de s’intéresser aux comportements des consommateurs sur cette dernière. Plus précisément, nous cherchons à comprendre quelles sont les caractéristiques qui influencent le potentiel succès d’une application sur le “Google play store”. Ainsi, notre objectif est de concevoir et d’implémenter un outil permettant de visualiser efficacement et sous plusieurs angles des données d’applications issues de la plateforme. L’outil que nous allons développer permettra d’explorer ces données et d’en tirer de potentielles conclusions.",
  gotoViz: "Voir visualisation",
  vizualisations: {
    first: {
      title:
        "Visualisation 1 :<br></br>Exploration du comportement des variables catégoriques et des téléchargements",
      content:
        "La première visualisation est un outil qui permet d’explorer le comportement des variables catégoriques en fonction du nombre de téléchargements. Ainsi, la visualisation permettra de comparer chacune des variables (une à la fois) suivantes avec une des métriques représentant le nombre de téléchargements (une à la fois) : Catégorie d’application , évaluation de contenu , version minimale d’Android requise , genres et type (application payante ou application gratuite)",
    },
    second: {
      title:
        "Visualisation 2 :<br></br>Comparaison des distributions des applications gratuites et payantes",
      content:
        "La seconde visualisation est un outil qui permet de comparer les  distributions des applications payantes et gratuites selon deux  variables catégoriques : Évaluation de contenu et catégorie. Il  permet également d’avoir une idée sur le comportement des prix des  applications selon la variable du type (application gratuite ou  payante).<br></br>",
    },
    third: {
      title:
        " Visualisation 3 :<br></br>Exploration du comportement des variables numériques et des téléchargements",
      content:
        " La troisième visualisation est un outil qui permet d’explorer le comportement des variables numériques en fonction du nombre de téléchargements. Ainsi, la visualisation permettra d’étudier le comportement des variables suivantes en fonction du nombre de téléchargements : Taille de l’application , prix des applications payantes (comparaison entre les applications payantes) , potes et nombre de revues des applications",
    },
  },
};

const stringToHtml = (text) => {
  return require("html-react-parser")(text);
};

function Home() {
  return (
    <Box backgroundColor={"#d3d3d3"} height={"100vh"}>
      <NavBar></NavBar>
      <Typography variant="h1" color="text.primary" pl={"40%"}>
        {texts.title}
      </Typography>
      <Typography
        variant="body2"
        align="justify"
        color="text.secondary"
        pl={"10%"}
        pr={"10%"}
        pt={2}
      >
        {texts.introduction}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
        pt={5}
      >
        <Card sx={{ width: 500, border: 1, height: "auto" }} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz1.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              align="center"
              component="div"
            >
              {stringToHtml(texts.vizualisations.first.title)}
            </Typography>
            <Typography variant="body2" align="justify" color="text.secondary">
              {texts.vizualisations.first.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={"/categorical"}>
              {texts.gotoViz}
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 500, border: 1, height: "auto" }} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz2.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              align="center"
              component="div"
            >
              {stringToHtml(texts.vizualisations.second.title)}
            </Typography>
            <Typography variant="body2" align="justify" color="text.secondary">
              {stringToHtml(texts.vizualisations.second.content)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={"/type"}>
              {texts.gotoViz}
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ width: 500, border: 1, height: "auto" }} elevation={12}>
          <CardMedia
            component="img"
            height="200"
            image={require("./viz3.png")}
            alt="green iguana"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              align="center"
              component="div"
            >
              {stringToHtml(texts.vizualisations.third.title)}
            </Typography>
            <Typography variant="body2" align="justify" color="text.secondary">
              {texts.vizualisations.third.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" component={Link} to={"/numerical"}>
              {texts.gotoViz}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
