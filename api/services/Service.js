module.exports = {
	divide_timestamp: function(timestamp, share_timestamp, callback){
		var time;
		var x = [];

		time = timestamp.split('-');
		x.year = time[0];
		x.month = time[1];
		time = time[2].split('T');
		x.day = time[0];
		time = time[1].split(':');
		x.hour = time[0];

		//colocando no horario de brasilia (-3 horas)
		a = Number(x.hour);
		if((a-3) >= 0 ) x.hour = Number(x.hour) - 3;
		else{
			x.hour = 24 - (3 - a);
			x.day = Number(x.day) - 1;
		}
		x.minute = time[1];
		
		if(share_timestamp == "")
			callback(x);
		else{

			time = share_timestamp.split('-');
			x.syear = time[0];
			x.smonth = time[1];
			time = time[2].split('T');
			x.sday = time[0];
			time = time[1].split(':');
			x.shour = time[0];

			//colocando no horario de brasilia (-3 horas)
			a = Number(x.hour);
			if((a-3) >= 0 ) x.shour = Number(x.shour) - 3;
			else{
				x.shour = 24 - (3 - a);
				x.sday = Number(x.sday) - 1;
			}
			x.sminute = time[1];

			callback(x);
		}
	},
}