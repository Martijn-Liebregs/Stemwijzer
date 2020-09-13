let Stemwijzer = function(){

	// Some variables
	let question = 25;
	let party_vote_count = {};
	let votes = [];
	let weighted_questions = [];

	// Get elements by id
	let main = document.getElementById('main');
	let title_div = document.getElementById('title');
	let statement_div = document.getElementById('statement');
	let weighted_div = document.getElementById('weighted_questions');
	// Get elements by id
	let start_btn = document.getElementById('start');
	let vote_btn_pro = document.getElementById('vote_btn_pro');
	let vote_btn_contra = document.getElementById('vote_btn_contra');
	let vote_btn_none = document.getElementById('none');
	let vote_btn_skip = document.getElementById('skip');
	// Get elements by id
	let prev_btn = document.getElementById('previous');
	let done_btn = document.getElementById('done');
	let restart_btn = document.getElementById('restart')
	// Get elements by id
	let show_opinion = document.getElementById('opinion');
	let show_big_parties = document.getElementById('bigParties');
	let show_secular_parties = document.getElementById('smallParties');
	let results_div = document.getElementById('results');

	// Set element displays
	vote_btn_pro.style.display = 'none';
	vote_btn_contra.style.display = 'none';
	vote_btn_none.style.display = 'none';
	vote_btn_skip.style.display = 'none';
	prev_btn.style.display = 'none';
	show_big_parties.style.display = 'none';
	show_secular_parties.style.display = 'none';
	done_btn.style.display = 'none';
	weighted_div.style.display = 'none';
	restart_btn.style.display = 'none';

	// Set events
	start_btn.onclick = () => {
		// Set display
		start_btn.style.display = 'none';
		vote_btn_pro.style.display = 'inline-block';
		vote_btn_contra.style.display = 'inline-block';
		vote_btn_none.style.display = 'inline-block';
		vote_btn_skip.style.display = 'inline-block';
		prev_btn.style.display = 'inline-block';

		// Fill party votes
		for(let i = 0; i < parties.length; i++){
			party_vote_count[parties[i].name] = 0;
		}
		// Call functions
		loadQuestion(question);
	};

	prev_btn.onclick = () => {
		if(question !== 0){
			// Decrement question
			question--;
			// Load previous question
			loadQuestion(question);
		}
	};

	show_opinion.onclick = () => {
		// Set opinion text
		for(let i = 0; i < subjects[question]['parties'].length; i++){

			let name = document.createElement('h2');
			let vote = document.createElement('h5');
			let opinion = document.createElement('p');

			name.innerHTML = subjects[question]['parties'][i].name;
			opinion.innerHTML = subjects[question]['parties'][i].opinion;

			// Translate vote
			let translated = '';

			switch(subjects[question]['parties'][i].position){
				case 'pro':
					translated = 'Eens';
					break;
				case 'contra':
					translated = 'Oneens';
					break;
				case 'none':
					translated = 'Niks';
					break;
			}

			vote.innerHTML 	= translated;

			opinion_div.appendChild(name);
			opinion_div.appendChild(vote);
			opinion_div.appendChild(opinion);
		}

		// Toggle display
		if(opinion_div.style.display === 'none'){
			opinion_div.style.display = 'block';
		}
		else {
			opinion_div.style.display = 'none';
		}
	};

	done_btn.onclick = () => {
		// Calculate results
		let point;
		for(let i = 0; i < subjects.length; i++){
	        for(let j = 0; j < subjects[i]['parties'].length; j++){
	            if(votes[i] == subjects[i]['parties'][j]['position']){
	                if(weighted_questions.indexOf(i) != -1){
	                	// Question is weighted
	                    point = subjects[i]['parties'][j]['name'];
	                    party_vote_count[point] += 2;
	                } 
	                else {
	                	// Question is not weighted
	                    point = subjects[i]['parties'][j]['name'];
	                    party_vote_count[point]++;
	                }
	            }
	        }
	    }
		showResults(party_vote_count);
	};

	restart.onclick = () => {
		location.reload();
	};

	// Vote events
	vote_btn_pro.addEventListener('click', function(){
		vote('pro');
	});
	vote_btn_contra.addEventListener('click', function(){
		vote('contra');
	});
	vote_btn_none.addEventListener('click', function(){
		vote('none');
	});
	vote_btn_skip.addEventListener('click', function(){
		vote('s');
	});

	function loadQuestion(q){
		if(q < subjects.length){
            // Load new question
            let buttons = document.querySelectorAll("button[data-vote]");

            for(let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("red");
            }

            title_div.innerHTML = (question+1) + '. ' + subjects[q]['title'];
            statement_div.innerHTML = '"'+subjects[q]['statement']+'"';
            if (votes[q] != undefined) {

                let voted = document.querySelectorAll("button[data-vote='"+votes[q]+"']")[0];
                voted.classList.add("red");
            }
        }

		else {
			// End of questions
			title_div.innerHTML = 'Kies de vragen die zwaar moeten mee tellen.';
			statement_div.innerHTML = '';

			vote_btn_pro.style.display = 'none';
			vote_btn_contra.style.display = 'none';
			vote_btn_none.style.display = 'none';
			vote_btn_skip.style.display = 'none';
			prev_btn.style.display = 'none';
			show_big_parties.style.display = 'none';
			show_secular_parties.style.display = 'none';
			done_btn.style.display = 'inline-block';
			loadWeightedQuestions();
		}
	}

	function vote(v){
		// Save vote
		votes[question] = v;

		// Increment question
		question++;

		// Load new question
		loadQuestion(question);
	}

	function loadWeightedQuestions(){
		// Load questions
		for(let i = 0; i < subjects.length; i++){

			let q = document.createElement('h5');

			// Set attributes
			q.id 		= i;
			q.innerHTML = subjects[i].title;

			weighted_div.appendChild(q);

			// Onclick event
			q.onclick = (e) => {
				// Toggle class
				e.target.classList.toggle('selected');

				// Toggle weighted question
				if(!weighted_questions.includes(e.target.id)){
					weighted_questions.push(e.target.id);
				}
				else {
					weighted_questions.splice(weighted_questions.indexOf(e.target.id), 1);
				}
			}
		}
		// Set display
		weighted_div.style.display = 'block';
	}

	function showResults(vote_count){
		// Set display
		weighted_div.style.display = 'none';
		done_btn.style.display = 'none';
		restart_btn.style.display = 'inline-block';

		title_div.innerHTML = 'Uw resultaat:';

		sorted_keys = Object.entries(vote_count).sort((a, b) => b[1] - a[1]).map(el => el[0]);

	    let names = Object.values(sorted_keys);

	    for(i = 0; i < Object.keys(sorted_keys).length; i++){
	        let party = document.createElement('h3');
	        party.innerHTML = (i+1) + '. ' + names[i];
	        results_div.appendChild(party);
	    }
	}

}();
