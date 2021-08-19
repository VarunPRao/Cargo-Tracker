package main;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "airports")
public class Data {
	
	@Id
	private double id;
	
	//@Column(columnDefinition = "char")
	private String iataCode;  
	
	private String tyype;
	private String namme;
	private double latitude_deg;
	private double longitude_deg;
	private String continent;
	private String iso_country;
	private String municipality;

	public Data() 
	{
		
	}

	public String getIata_code() {
		return iataCode;
	}

	public void setIata_code(String iata_code) {
		this.iataCode = iata_code;
	}

	public double getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return tyype;
	}

	public void setType(String tyype) {
		this.tyype = tyype;
	}

	public String getName() {
		return namme;
	}

	public void setName(String namme) {
		this.namme = namme;
	}

	public double getLatitude_deg() {
		return latitude_deg;
	}

	public void setLatitude_deg(double latitude_deg) {
		this.latitude_deg = latitude_deg;
	}

	public double getLongitude_deg() {
		return longitude_deg;
	}

	public void setLongitude_deg(double longitude_deg) {
		this.longitude_deg = longitude_deg;
	}

	public String getContinent() {
		return continent;
	}

	public void setContinent(String continent) {
		this.continent = continent;
	}

	public String getIso_country() {
		return iso_country;
	}

	public void setIso_country(String iso_country) {
		this.iso_country = iso_country;
	}

	public String getMunicipality() {
		return municipality;
	}

	public void setMunicipality(String municipality) {
		this.municipality = municipality;
	}
}
