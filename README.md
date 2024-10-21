# Verifica sulla definizione e uso di un server NODEJS
## Obiettivo
Completare il sito web che rende disponibile le ricette inserite dagli utenti.

### LE RICETTE VENGONO RACCOLTE SOLO LATO SERVER
Dopo aver studiato il codice e provato è necessario togliere il vettore presente lato client nel file js, è infatti richiesto di lavorare sui dati presenti solo lato server!
I dati nel js servono solo nella fase di test dell'interfaccia grafica del client.

### CONSEGNA 

- Creare l'intera struttura di gestione delle richieste mediante SWITCH o DISPATCHER
- Sviluppare i seguenti tre servizi:
  - RITORNO DELLE RICETTE
  - RITORNO DELLE RICETTE CONTENENTI UN TESTO INDICATO DALL'UTENTE (il valore è da ricercare nei campi titolo o tipo di ciascuna ricetta)
  - INSERIMENTO DI UNA NUOVA RICETTA nell'array delle ricette
- Richiamare in modo opportuno i servizi definiti lato server passando i parametri richiesti e aggiornando l'interfaccia del client

### TEMPO AGGIUNTIVO
Chi può accedere al tempo aggiuntivo è dispensato dalla creazione del primo servizio relativo al ritorno delle ricette e anche dal caricamento delle ricette all'avvio del sito. In altre parole deve gestire solo:
- la ricerca delle ricette collegandosi al servizio lato server che cerca nel vettore di ricette
- il salvataggio su server della nuova ricetta proposta dall'utente 
