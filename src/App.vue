<template>
  <v-app>
    <v-content
      ><v-progress-linear
        color="light-blue"
        height="10"
        striped
        :value="(i / questions.length) * 100"
      >
      </v-progress-linear>
      <v-col align="center" justify="center">
        <v-card max-width="800" class="pa-6" v-if="!emailValid || typing"
          ><p class="text-justify">
            Les évaluations « quizz diététique », « quizz comportemental », «
            qualité de vie », « quizz activité physique », « estime de soi »
            seront proposées au moment du diagnostic éducatif, puis en fin de
            parcours avant le bilan de synthèse afin de permettre le bilan des
            compétences acquises lors du programme.
          </p>
          <p class="text-justify">
            Elle permettront d’évaluer et d’adapter au mieux les thématiques
            proposées au patient, afin de choisir les ateliers les plus
            appropriés lors de son parcours.
          </p>
          <p class="text-justify">
            Lors du bilan de synthèse il sera également proposé au patient de
            remplir la fiche « projet de vie ». Celle-ci pourra faire le lien
            avec d’autres actions pour le suivi du patient.
          </p>
          <br />
          <p>
            Les questions vous seront proposées dès que vous aurez renseigné
            votre mail
          </p>
          <br />
          <p>
            Les résultats de ce test seront envoyés au docteur Corinne Godenir
          </p>
        </v-card>
        <v-card flat max-width="600" class="ma-6">
          <v-text-field
            outlined
            v-model="name"
            label="Veuillez donner votre nom (pour le médecin)"
          >
          </v-text-field>
          <v-text-field
            outlined
            @input="setTyping"
            v-model="email"
            label="Entrez votre email SVP"
          >
          </v-text-field>
        </v-card>

        <v-card
          max-width="1200"
          class="pa-6"
          v-if="
            questions &&
              questions.length > 0 &&
              emailValid &&
              i != questions.length &&
              !typing
          "
        >
          <v-card-title class="grey--text">{{
            questions[i].title
          }}</v-card-title>
          <v-card-text>
            <h3 v-if="questions[i].d">
              {{ questions[i].d }}
            </h3>
            <br v-if="questions[i].d" />
            <h2>
              <b>{{ Number(questions[i].j) + 1 }}:&nbsp;</b
              >{{ questions[i].question }}
            </h2>
            <v-row align="center" justify="center">
              <v-radio-group
                v-if="questions[i].type == 'boolean'"
                row
                v-model="questions[i].answer"
              >
                <v-radio label="Vrai" value="vrai"></v-radio>
                <v-radio label="Faux" value="faux"></v-radio>
              </v-radio-group>
              <v-radio-group
                v-else-if="questions[i].type == '4choices'"
                row
                v-model="questions[i].answer"
              >
                <v-radio label="Tout à fait en désaccord" value="1"></v-radio>
                <v-radio label="Plutôt en désaccord" value="2"></v-radio>
                <v-radio label="Plutôt en accord" value="3"></v-radio>
                <v-radio label="Tout à fait d’accord" value="4"></v-radio>
              </v-radio-group>
              <v-col
                v-else-if="questions[i].type == '10choices'"
                row
                message="this is a test"
              >
                <v-row align="center" justify="center">
                  <div class="mx-4">Sans importance</div>
                  <div class="mx-4">Peu importante</div>
                  <div class="mx-4">Assez importante</div>
                  <div class="mx-4">Très importante</div>
                </v-row>
                <v-row align="center" justify="center">
                  <v-radio-group row v-model="questions[i].answer">
                    <v-radio
                      v-for="i in 10"
                      :key="i"
                      :label="String(i)"
                      :value="i"
                    ></v-radio>
                  </v-radio-group>
                </v-row>
              </v-col>
              <v-textarea
                outlined
                v-else-if="questions[i].type == 'text'"
                v-model="questions[i].answer"
              ></v-textarea>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn v-if="i != 0" @click="previous">Précédent</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="light-blue lighten-2"
              :disabled="!questions[i].answer"
              @click="next"
              class="white--text"
              >Suivant</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card max-width="800" v-if="questions.length == i">
          <v-card-title v-if="done"
            >Merci d'avoir participé à ce questionnaire</v-card-title
          >
          <v-card-text>
            <v-btn
              :error="error"
              :loading="loading"
              dark
              :disabled="loading || done"
              :color="done ? 'green' : 'primary'"
              @click="send"
              >SOUMETTRE
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import questions from "./questions.json";

export default {
  name: "App",
  data: () => ({
    i: 0,
    name: "",
    url: "https://dev-api.eu-west-3.datapony.co/carambole",
    loading: false,
    error: false,
    done: false,
    typing: false,
    tmt: null
  }),
  methods: {
    setTyping() {
      this.typing = true;
      clearTimeout(this.tmt);
      this.tmt = setTimeout(
        () => {
          this.typing = false;
        },
        800,
        this
      );
    },
    send() {
      this.loading = true;
      axios
        .post(this.url, {
          questions: this.questions,
          name: this.name,
          email: this.email
        })
        .then(res => {
          this.loading = false;
          this.done = true;
        })
        .catch(() => {
          this.error = true;
          this.loading = false;
        });
    },
    next() {
      if (this.i != this.questions.length) {
        this.i += 1;
      }
    },
    previous() {
      if (this.i != 0) {
        this.i -= 1;
      }
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  },
  computed: {
    emailValid() {
      return this.validateEmail(this.email);
    },
    email: {
      get() {
        return this.$store.state.email;
      },
      set(email) {
        this.$store.commit("SET", { email: email.toLowerCase() });
      }
    },
    questions: {
      get() {
        return this.$store.state.questions;
      },
      set(questions) {
        this.$store.commit("SET", { questions });
      }
    }
  },
  mounted() {
    let output = [];
    for (let i in questions) {
      const them = questions[i];
      for (let j in them.questions) {
        output.push({
          id: j + i,
          j,
          question: them.questions[j],
          answer: "",
          type: them.type,
          category: them.name,
          d: them.pre,
          title: them.title
        });
      }
      this.$store.commit("SET", { questions: output });
    }
  }
};
</script>
