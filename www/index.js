fields = ['hp','atk','def','spa','spd','spe'];

function pad(n,width,z)
{
	z = z || '0';
	n = n + '';
	
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function loadPokemonData(value)
{
	window.active = BattlePokedex[value];

	window.natures = {};
	
	for (field in fields)
	{
		temp = fields[field];
		
		window.natures[temp] = 1.0;
		document.getElementById(temp+'Default').selected = "selected";
		document.getElementById(temp+'Base').value = active.baseStats[temp];
	}

	let msgdiv = document.getElementById('selecteddiv');
	
	msgdiv.innerHTML = "<p id='selectedmsg'>(Currently Selected: "+active.species+")</p>";
	
	var img = document.createElement("img");
	img.id = "icon";
	
	if(active.num > 0)
	{
		img.src = 'img/'+pad(active.num,3) + '.png';
	}
	else
	{
		img.src = 'img/000.png';
	}

	document.getElementById('selectedmsg').appendChild(img);
	
	setFields();
}

function setLevelData(level = null)
{
	if(level)
	{
		window.level = level;
	}
	else
	{
		window.level = document.getElementById('level').value;
	}
	
	let lvldiv = document.getElementById('leveldiv');
	lvldiv.innerHTML = "<p>(Currently Selected: "+window.level+")</p>";
	
	setFields();
}

function setFields()
{
	
	for(field in fields)
	{
		temp = fields[field];
		
		updateFields(temp);
		
		reset(temp);
	}
}

function reset(value)
{
	
	if(window.active)
	{
		let active = window.active;
		let bs = active.baseStats;
	
		let min = document.getElementById(value+'Min');
		let max = document.getElementById(value+'Max');
		
		if(value == 'hp')
		{
			min.value = hp(bs[value],31,0,window.level);
			max.value = hp(bs[value],31,252,window.level);
		}
		else
		{
			min.value = stat(bs[value],31,0,window.level,1.0);
			max.value = stat(bs[value],31,252,window.level,1.0);
		}
	}
	
	getRequiredEVs(value);
}

function updateFields(value)
{
	if(window.active)
	{
		let active = window.active;
		let bs = active.baseStats;
		
		var best,neutral,worst;

		if(value == 'hp')
		{
			best = hp(bs[value],31,252,window.level);
			neutral = hp(bs[value],31,0,window.level);
			worst = hp(bs[value],0,0,window.level);
		}
		else
		{
			best = stat(bs[value],31,252,window.level,window.natures[value]);
			neutral = stat(bs[value],31,0,window.level,window.natures[value]);
			worst = stat(bs[value],0,0,window.level,window.natures[value]);
		}
		
		document.getElementById(value+'Top').value = best;
		document.getElementById(value+'Med').value = neutral;
		document.getElementById(value+'Bot').value = worst;
		
	}
	else
	{
		console.error('No active Pokemon selected!');
	}
}

function updateNature(setting, value=null)
{
	let changed = document.getElementById(setting+'Select');
	
	if(changed.value == 'neutral')
	{
		window.natures[setting] = 1.0;
	}
	else
	{
		if(changed.value == 'boosting')
		{
			window.natures[setting] = 1.1;
		}
		else
		{
			window.natures[setting] = 0.9;
		}
		
		for (let field = 1; field < fields.length; field++)
		{
			temp = fields[field];
			
			if(temp != setting)
			{
				other = document.getElementById(temp+'Select');
				
				if(other.value == changed.value)
				{
					other.value = 'neutral';
					updateNature(temp);
				}
			}
		}
	}
	
	updateFields(setting);
	getRequiredEVs(setting)
}

function getRequiredEVs(setting)
{
	let active = window.active;
	let bs = active.baseStats;
	
	var min,max,vmin,tmin,tmax;
	
	min = document.getElementById(setting+'Min');
	max = document.getElementById(setting+'Max');
	
	if(setting=='hp')
	{
		let min31iv = hp(bs[setting],31,0,window.level,min.value);
		let max31iv = hp(bs[setting],31,252,window.level,min.value);
		
		//console.log(min31iv + "," + min.value);
		
		if(min31iv > min.value)
		{
			vmin = getRequiredHPIVs(bs[setting],window.level,min.value);
			
			if(vmin < 0)
			{
				vmin = "Invalid IVs";
			}

			tmin = 0;

		}
		else
		{
			tmin = getRequiredHPEVs(bs[setting],31,window.level,min.value);
		}
		
		if(max31iv >= max.value)
		{
			tmax = getRequiredHPEVs(bs[setting],31,window.level,max.value);
		}
		else
		{
			tmax = "Invalid EVs";
		}
	}
	else
	{
		let min31iv = stat(bs[setting],31,0,window.level,window.natures[setting],min.value);
		let max31iv = stat(bs[setting],31,252,window.level,window.natures[setting],min.value);
		
		//console.log(max31iv + "," + max.value);
		
		if(min31iv > min.value)
		{
			vmin = getRequiredStatIVs(bs[setting],window.level,window.natures[setting],min.value);
			
			if(vmin < 0)
			{
				vmin = "Invalid IVs";
			}

			tmin = 0;
		}
		else
		{
			tmin = getRequiredStatEVs(bs[setting],31,window.level,window.natures[setting],min.value);
		}
		
		if(max31iv >= max.value)
		{
			tmax = getRequiredStatEVs(bs[setting],31,window.level,window.natures[setting],max.value);
		}
		else
		{
			tmax = "Invalid EVs";
		}
	}
	
	minlbl = document.getElementById(setting+'MinLbl');
	maxlbl = document.getElementById(setting+'MaxLbl');
	
	minlbl.innerHTML = "<p> Required EVs: " + tmin + " </p>";
	
	if(vmin)
	{
		minlbl.innerHTML += "<p> Required IVs: " + vmin + "</p>";
	}
	
	maxlbl.innerHTML = "<p> Required EVs: " + tmax + " </p>";
}
