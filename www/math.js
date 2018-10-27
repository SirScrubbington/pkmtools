function stat(B,I,E,L,N)
{
	return Math.floor((((I + 2 * B + (E/4)) * L / 100) + 5) * N);
}

function hp(B,I,E,L)
{
	return Math.floor(((I + 2 * B + (E / 4)) * L / 100) + 10 + L);
}

function roundToMultiple(x,y)
{
	return Math.floor(x / y) * y;
}

function findMinEVIV(f,target,min)
{
	if (f(min-1) == target)
	{
		return findMinEVIV(f,target,min-1);
	}
	else if (min < 0)
		return 0;
	else
	{
		return min;
	}
}

function bsearch(f,a,b,target,depth=0,maxdepth=20)
{
	if(a == b || depth > maxdepth)
	{
		 return (b + a) / 2;
	}

	c = Math.round((b+a)/2);
	
	fc = f(c);

	if (fc > target)
	{
		return bsearch(f,a,c,target,depth + 1,maxdepth);
	}
	else
	{
		return bsearch(f,c,b,target,depth + 1,maxdepth);
	}
}

function getRequiredHPEVs(B,I,L,T)
{
	function f(x)
	{
		return hp(B,I,x,L);
	}

	let temp = roundToMultiple(findMinEVIV(f,T,Math.round(bsearch(f,0,252,T))),4);
	
	console.log(temp);
	
	return temp;
}

function getRequiredStatEVs(B,I,L,N,T)
{
	function f(x)
	{
		return stat(B,I,x,L,N);
	}
	
	let temp = roundToMultiple(findMinEVIV(f,T,Math.round(bsearch(f,0,252,T))),4);
	
	console.log(temp);
	
	return temp;
}

function getRequiredHPIVs(B,L,T)
{
	function f(x)
	{
		return hp(B,x,0,L);
	}
	
	let temp = findMinEVIV(f,T,Math.round(bsearch(f,0,31,T)));
	
	console.log(temp);
	
	return temp;
}

function getRequiredStatIVs(B,L,N,T)
{
	function f(x)
	{
		return stat(B,x,0,L,N);
	}
	
	let temp = findMinEVIV(f,T,Math.round(bsearch(f,0,31,T)));
	
	console.log(temp);
	
	return temp;
}