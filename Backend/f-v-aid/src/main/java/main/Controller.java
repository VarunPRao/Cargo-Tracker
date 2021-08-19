package main;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller 
{
	@Autowired
	private fService service;
	
	@CrossOrigin(origins = "http://localhost:8000")
	@RequestMapping("/coords")
	public Object[] getCoordinates(@RequestParam List<String> codes)
	{
		ArrayList<Location> coords = new ArrayList<Location>();
		for(int i = 0; i < codes.size(); ++i) 
		{
			coords.add(service.getCoordinates(codes.get(i)));
		}
		
		return coords.toArray();
	}
}
