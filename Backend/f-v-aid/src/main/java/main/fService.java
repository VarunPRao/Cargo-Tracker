package main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class fService 
{
	@Autowired
	private fRepository repo;
	
	public Location getCoordinates(String code1) 
	{
		System.out.println("" + code1);
		Data d1 = repo.findByIataCode(code1);
		
		if (d1 == null)
			System.out.println("Not found in repository.");
		else
			System.out.println(" : " + d1.getMunicipality());
		
		return new Location (d1.getLatitude_deg(), d1.getLongitude_deg());
	}
}
